﻿namespace EventKey_1.Server.Models
{
    public class FeedbackDto
    {
        public string UserId { get; set; }
        public string EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string FeedbackText { get; set; }
        public int Rating { get; set; }
        public IFormFile Image { get; set; } // For uploading images
    }
}
