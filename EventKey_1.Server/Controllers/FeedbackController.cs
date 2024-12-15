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
            try
            {
                // Check if feedbackDto is null
                if (feedbackDto == null)
                {
                    return BadRequest(new { Message = "Feedback cannot be null." });
                }

                // Validate required fields
                if (string.IsNullOrEmpty(feedbackDto.UserId) ||
                    string.IsNullOrEmpty(feedbackDto.EventId) ||
                    string.IsNullOrEmpty(feedbackDto.EventName) ||
                    feedbackDto.EventDate == default ||
                    string.IsNullOrEmpty(feedbackDto.FeedbackText) ||
                    feedbackDto.Rating < 1 || feedbackDto.Rating > 5)
                {
                    return BadRequest(new { Message = "One or more required fields are missing or invalid." });
                }

                // Handle image upload
                string imagePath = null;
                if (feedbackDto.Image != null)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var fileExtension = Path.GetExtension(feedbackDto.Image.FileName).ToLower();
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest(new { Message = "Invalid file type. Only JPG, PNG, and GIF are allowed." });
                    }

                    // Validate file size (5 MB max)
                    const long maxFileSize = 5 * 1024 * 1024; // 5 MB
                    if (feedbackDto.Image.Length > maxFileSize)
                    {
                        return BadRequest(new { Message = "File size exceeds the maximum allowed size of 5 MB." });
                    }

                    try
                    {
                        // Save the image to the server
                        var uploadsFolder = Path.Combine("wwwroot", "images", "feedback");
                        Directory.CreateDirectory(uploadsFolder); // Ensure the folder exists
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(feedbackDto.Image.FileName);
                        var filePath = Path.Combine(uploadsFolder, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await feedbackDto.Image.CopyToAsync(stream);
                        }
                        imagePath = Path.Combine("images", "feedback", fileName); // Relative path for client use
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { Message = $"Error saving the image: {ex.Message}" });
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
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"An error occurred: {ex.Message}" });
            }
        }


        // GET: api/Feedback/{eventId}
        [HttpGet("{eventId}")]
        public IActionResult GetFeedbackByEvent(string eventId)
        {
            try
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
                {
                    return NotFound(new { Message = "No feedback found for this event." });
                }

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpDelete("Event/{eventId}")]
        public async Task<IActionResult> DeleteFeedbackByEvent(string eventId)
        {
            try
            {
                // Retrieve all feedback records for the given EventId
                var feedbacks = _context.Feedbacks.Where(f => f.EventId == eventId).ToList();

                if (!feedbacks.Any())
                {
                    return NotFound(new { Message = "No feedback found for the specified EventId." });
                }

                // Delete associated images if they exist
                foreach (var feedback in feedbacks)
                {
                    if (!string.IsNullOrEmpty(feedback.ImagePath))
                    {
                        var imagePath = Path.Combine("wwwroot", feedback.ImagePath);
                        if (System.IO.File.Exists(imagePath))
                        {
                            System.IO.File.Delete(imagePath);
                        }
                    }
                }

                // Remove feedback records from the database
                _context.Feedbacks.RemoveRange(feedbacks);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "All feedback for the specified EventId deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
