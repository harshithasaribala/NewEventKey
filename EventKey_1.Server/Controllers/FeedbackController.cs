using EventKey_1.Server.Infrastructure;
using EventKey_1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace EventKey_1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly DataContext _context; // Your DbContext
        private readonly IConfiguration _configuration;

        public FeedbackController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Feedback
        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromForm] FeedbackDto feedbackDto)
        {
            if (feedbackDto == null)
                return BadRequest("Feedback cannot be null.");

            // Handle image upload
            string imagePath = null;
            if (feedbackDto.Image != null)
            {
                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(feedbackDto.Image.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                }

                // Validate file size (5 MB max)
                const long maxFileSize = 5 * 1024 * 1024; // 5 MB
                if (feedbackDto.Image.Length > maxFileSize)
                {
                    return BadRequest("File size exceeds the maximum allowed size of 5 MB.");
                }

                try
                {
                    var uploadsFolder = Path.Combine("wwwroot", "images", "feedback");
                    Directory.CreateDirectory(uploadsFolder);
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(feedbackDto.Image.FileName);
                    imagePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await feedbackDto.Image.CopyToAsync(stream);
                    }
                    imagePath = Path.Combine("images", "feedback", fileName); // Relative path for client use
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

            // Save feedback to database
            var feedback = new Feedback
            {
                UserId = feedbackDto.UserId,
                EventId = feedbackDto.EventId,
                EventName = feedbackDto.EventName,
                EventDate = feedbackDto.EventDate,
                FeedbackText = feedbackDto.FeedbackText,
                Rating = feedbackDto.Rating,
                ImagePath = imagePath,
                CreatedAt = DateTime.Now
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Feedback submitted successfully.", FeedbackId = feedback.FeedbackId });
        }

        // GET: api/Feedback/{eventId}
        [HttpGet("{eventId}")]
        public IActionResult GetFeedbackByEvent(string eventId)
        {
            var feedbacks = _context.Feedbacks
                .Where(f => f.EventId == eventId)
                .Select(f => new
                {
                    f.UserId,
                    f.EventName,
                    f.EventDate,
                    f.FeedbackText,
                    f.Rating,
                    ImageUrl = string.IsNullOrEmpty(f.ImagePath) ? null : $"{Request.Scheme}://{Request.Host}/{f.ImagePath}",
                    f.CreatedAt
                })
                .ToList();

            if (!feedbacks.Any())
                return NotFound("No feedback found for this event.");

            return Ok(feedbacks);
        }
    }
}
