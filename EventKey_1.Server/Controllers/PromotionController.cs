using EventKey_1.Server.Services; // Import the namespace for IEmailService
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventKey_1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public PromotionController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendPromotionEmail([FromBody] SendPromotionRequest request)
        {
            try
            {
                var logoUrl = "images/logo.jpeg"; // Path to the logo in the wwwroot folder
                await _emailService.SendPromotionEmailAsync(request.Subject, request.Body, request.Recipients, logoUrl);
                return Ok("Promotion email sent successfully!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }

    // DTO to accept email request
    public class SendPromotionRequest
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<string> Recipients { get; set; }
    }
}
