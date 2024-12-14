using EventKey_1.Server.Migrations;
using System.ComponentModel.DataAnnotations;

namespace EventKey_1.Server.Models
{
    public class SavedEvent
    {
        [Key]
        public int SavedEventId { get; set; }
        public required string UserId { get; set; }
        public required string EventId { get; set; } // Reference to the Event that is saved
        public required string EventName { get; set; } // Event name
        public required DateTime EventDate { get; set; } // Event date
        public required TimeSpan EventTime { get; set; } // Event time
        public required decimal TicketPrice { get; set; } // Event ticket price
        //public virtual Events Event { get; set; }
    }
}
