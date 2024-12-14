using System.ComponentModel.DataAnnotations;

namespace EventKey_1.Server.Models
{
    public class Bookings
    {
        [Key] // Marks this property as the primary key
        public int BookingId { get; set; }
        public required string UserId { get; set; }
        public required string EventId { get; set; }
        public required int NumberOfTickets { get; set; }
        public required decimal TotalAmount { get; set; }
        public required string EventName { get; set; }
        public required DateTime EventDate { get; set; }
        public required  string EventTime { get; set; }
        public required decimal TicketPrice {  get; set; }
        public required string EventLocation { get; set; }
        public required DateTime BookingDate { get; set; }
    }

}
