namespace EventKey_1.Server.Models
{
    public class Feedback
    {
        public int FeedbackId { get; set; }
        public string UserId { get; set; }
        public string EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string FeedbackText { get; set; }
        public int Rating { get; set; }
        public string ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
