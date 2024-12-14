using EventKey_1.Server.Infrastructure;
using EventKey_1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventKey_1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly DataContext _context;

        public BookingsController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Bookings booking)
        {
            if (booking == null)
            {
                return BadRequest("Booking data is invalid.");
            }

            // Ensure that EventId is valid
            if (string.IsNullOrEmpty(booking.EventId))
            {
                return BadRequest("EventId is required.");
            }

            // Get event details
            var eventDetails = await _context.Events.FindAsync(booking.EventId);
            if (eventDetails == null)
            {
                return NotFound("Event not found.");
            }

            // Calculate total amount
            booking.TotalAmount = booking.NumberOfTickets * eventDetails.TicketPrice;

            // Check if the user already has a booking for the same event
            var existingBooking = await _context.Bookings
                                                 .Where(b => b.UserId == booking.UserId && b.EventId == booking.EventId)
                                                 .FirstOrDefaultAsync();

            if (existingBooking != null)
            {
                // If booking exists, update the number of tickets
                existingBooking.NumberOfTickets += booking.NumberOfTickets;
                existingBooking.TotalAmount = existingBooking.NumberOfTickets * eventDetails.TicketPrice;

                _context.Bookings.Update(existingBooking);
            }
            else
            {
                // If no existing booking, add a new one
                _context.Bookings.Add(booking);
            }

            await _context.SaveChangesAsync();

            // Instead of CreatedAtAction, let's use Ok() to return the booking
            return Ok(booking); // Change from CreatedAtAction to Ok() for now to simplify.
        }



        // GET: api/Bookings/byUserId/{userId}
        [HttpGet("byUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Bookings>>> GetBookingsByUserId(string userId)
        {
            var bookings = await _context.Bookings.Where(b => b.UserId == userId).ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound("No bookings found for this user.");
            }

            return Ok(bookings);
        }

        // DELETE: api/Bookings/byUserIdEventId/{userId}/{eventId}
        [HttpDelete("byUserIdEventId/{userId}/{eventId}")]
        public async Task<IActionResult> DeleteBooking(string userId, string eventId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.UserId == userId && b.EventId == eventId);

            if (booking == null)
            {
                return NotFound("Booking not found.");
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent(); // Successfully deleted
        }
    }
}
