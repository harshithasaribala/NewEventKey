using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventKey_1.Server.Models
{
    public class Events
    {
        [Key]
        [Required]
        public string EventId { get; set; } = GenerateUniqueId();

        public string Email { get; set; }

        [Required]
        public string EventName { get; set; }

        [Required]
        public string Organizer { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public string Location { get; set; }

        public string Description { get; set; }

        [Required]
        public int TicketPrice { get; set; }

        [Required]
        public int MaxAttendees { get; set; }

        public int RegisteredAttendees { get; set; } = 0; // Default value

        // Foreign key to EventManager
        public string EMId { get; set; }

        [ForeignKey("EMId")]
        public EventManager EventManager { get; set; } // Navigation property

        // Generate unique ID
        private static string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
        }
    }
}
