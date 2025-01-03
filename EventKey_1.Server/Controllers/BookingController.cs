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
        private const decimal GST_RATE = 0.18m; // Fixed GST rate of 18%

        public BookingsController(DataContext context)
        {
            _context = context;
        }
        // Update all ranks in UserInsights
        public async Task UpdateUserRanks()
        {
            // Fetch all user insights ordered by TotalPoints (highest first)
            var userInsights = await _context.UserInsights
                                             .OrderByDescending(ui => ui.TotalPoints)
                                             .ToListAsync();

            // Update ranks for each user
            int rank = 1;
            foreach (var userInsight in userInsights)
            {
                userInsight.Rank = rank++;
                _context.UserInsights.Update(userInsight);
            }

            await _context.SaveChangesAsync();
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

            // Calculate base amount and total amount including GST
            var baseAmount = booking.NumberOfTickets * eventDetails.TicketPrice;
            var totalAmount = baseAmount + (baseAmount * GST_RATE);

            booking.TotalAmount = totalAmount;

            // Check if the user already has a booking for the same event
            var existingBooking = await _context.Bookings
                                                 .Where(b => b.UserId == booking.UserId && b.EventId == booking.EventId)
                                                 .FirstOrDefaultAsync();

            if (existingBooking != null)
            {
                // If booking exists, update the number of tickets and total amount
                existingBooking.NumberOfTickets += booking.NumberOfTickets;

                // Recalculate total amount for the updated ticket count
                var updatedBaseAmount = existingBooking.NumberOfTickets * eventDetails.TicketPrice;
                existingBooking.TotalAmount = updatedBaseAmount + (updatedBaseAmount * GST_RATE);

                _context.Bookings.Update(existingBooking);
            }
            else
            {
                // If no existing booking, add a new one
                _context.Bookings.Add(booking);
            }

            // Save booking changes
            await _context.SaveChangesAsync();

            // Update User Insights
            var userInsights = await _context.UserInsights
                                              .FirstOrDefaultAsync(ui => ui.UserId == booking.UserId);

            if (userInsights != null)
            {
                userInsights.TotalBookings += booking.NumberOfTickets;
                userInsights.TotalPoints += booking.NumberOfTickets * 10; // 10 points per booking
                

                _context.UserInsights.Update(userInsights);
            }
            else
            {
                var newUserInsights = new UserInsights
                {
                    UserId = booking.UserId,
                    TotalBookings = booking.NumberOfTickets,
                    TotalPoints = booking.NumberOfTickets * 10,
                    Rank = 0, // Temporary, will be updated in UpdateUserRanks
                   
                };
                _context.UserInsights.Add(newUserInsights);
            }

            await _context.SaveChangesAsync();

            // Update ranks for all users
            await UpdateUserRanks();

            return Ok(booking);
        }


        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bookings>>> GetAllBookings()
        {
            var bookings = await _context.Bookings.ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound("No bookings found.");
            }

            return Ok(bookings);
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

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueData()
        {
            // Fetch all bookings
            var bookings = await _context.Bookings.ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound("No bookings found.");
            }

            // Fetch event details for all unique EventIds in bookings
            var eventIds = bookings.Select(b => b.EventId).Distinct();
            var events = await _context.Events
                .Where(e => eventIds.Contains(e.EventId)) // Ensure 'EventId' is string
                .ToDictionaryAsync(e => e.EventId, e => e.TicketPrice);

            if (events == null || events.Count == 0)
            {
                return NotFound("No event details found.");
            }

            decimal totalRevenue = 0;
            var revenuePerEvent = new Dictionary<string, decimal>();

            // Calculate total revenue and revenue per event
            foreach (var booking in bookings)
            {
                if (events.TryGetValue(booking.EventId, out var ticketPrice))
                {
                    var baseAmount = booking.NumberOfTickets * ticketPrice;
                    var totalAmount = baseAmount + (baseAmount * GST_RATE); // Include GST
                    totalRevenue += totalAmount;

                    if (!revenuePerEvent.ContainsKey(booking.EventId))
                    {
                        revenuePerEvent[booking.EventId] = 0;
                    }
                    revenuePerEvent[booking.EventId] += totalAmount;
                }
            }

            // Calculate average revenue per event
            var averageRevenuePerEvent = revenuePerEvent.Any()
                ? revenuePerEvent.Values.Average()
                : 0;

            // Prepare data for frontend
            var revenuePerEventList = revenuePerEvent.Select(kvp => new
            {
                EventId = kvp.Key,
                Revenue = kvp.Value
            }).ToList();

            // Admin Commission Calculation (20%)
            var adminCommission = totalRevenue * 0.2m;

            return Ok(new
            {
                totalRevenue,
                adminCommission,
                averageRevenuePerEvent,
                revenuePerEvent = revenuePerEventList
            });
        }


        [HttpGet("salesData/{managerId}")]
        public async Task<IActionResult> GetSalesDataByManager(string managerId)
        {
            // Fetch events created by the manager (using EMId)
            var events = await _context.Events
                                       .Where(e => e.EMId == managerId)  // Filter by the ManagerId (EMId)
                                       .ToListAsync();

            if (events == null || events.Count == 0)
            {
                return NotFound("No events found for this manager.");
            }

            // Fetch bookings for these events
            var eventIds = events.Select(e => e.EventId).ToList();
            var bookings = await _context.Bookings
                                          .Where(b => eventIds.Contains(b.EventId))  // Filter bookings by EventId
                                          .ToListAsync();

            // Prepare sales data for each event
            var salesData = events.Select(e =>
            {
                // Get bookings for this event
                var eventBookings = bookings.Where(b => b.EventId == e.EventId).ToList();

                // Calculate total number of tickets booked for this event
                var totalTicketsBooked = eventBookings.Sum(b => b.NumberOfTickets);

                // Calculate remaining tickets
                var remainingTickets = e.MaxAttendees - totalTicketsBooked;
                
                return new
                {
                    EventId = e.EventId,
                    EventName = e.EventName,
                    TotalTicketsBooked = totalTicketsBooked,
                    RemainingTickets = remainingTickets,
                    MaxAttendees = e.MaxAttendees,
                    TicketPrice = e.TicketPrice
                };
            }).ToList();

            return Ok(salesData);
        }
        [HttpGet("eventBookings")]
        public async Task<IActionResult> GetEventBookings()
        {
            // Fetch all bookings
            var bookings = await _context.Bookings.ToListAsync();

            if (bookings == null || bookings.Count == 0)
            {
                return NotFound("No bookings found.");
            }

            // Fetch event details for all unique EventIds in bookings
            var eventIds = bookings.Select(b => b.EventId).Distinct();
            var events = await _context.Events
                                       .Where(e => eventIds.Contains(e.EventId))
                                       .ToListAsync();

            // Prepare data for visualization
            var eventBookings = bookings.Select(b =>
            {
                // Get the event details based on EventId
                var eventDetails = events.FirstOrDefault(e => e.EventId == b.EventId);

                return new
                {
                    b.BookingId,
                    b.UserId,
                    b.EventId,
                    b.NumberOfTickets,
                    b.TotalAmount,
                    b.EventName,
                    b.EventDate,
                    b.EventTime,
                    b.TicketPrice,
                    b.EventLocation,
                    b.BookingDate,
                    EventMaxAttendees = eventDetails?.MaxAttendees,
                    EventRegisteredAttendees = eventDetails?.RegisteredAttendees
                };
            }).ToList();

            return Ok(eventBookings);
        }
        [HttpGet("revenueData")]
        public async Task<IActionResult> GetRevenueDatas()
{
    // Fetch all bookings
    var bookings = await _context.Bookings.ToListAsync();

    if (bookings == null || bookings.Count == 0)
    {
        return NotFound("No bookings found.");
    }

    // Fetch event details for all unique EventIds in bookings
    var eventIds = bookings.Select(b => b.EventId).Distinct();
    var events = await _context.Events
                               .Where(e => eventIds.Contains(e.EventId))
                               .ToListAsync();

    // Prepare data for revenue visualization
    var revenueData = events.Select(e =>
    {
        // Get bookings for this event
        var eventBookings = bookings.Where(b => b.EventId == e.EventId).ToList();

        // Calculate total revenue for this event (Including GST)
        var totalRevenue = eventBookings.Sum(b => b.NumberOfTickets * b.TicketPrice * (1 + GST_RATE));

        return new
        {
            EventId = e.EventId,
            EventName = e.EventName,
            TotalRevenue = totalRevenue
        };
    }).ToList();

    return Ok(revenueData);
}
        // DELETE: api/Events/delete-all
        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAllBookings()
        {
            var allBookings = await _context.Bookings.ToListAsync();

            if (allBookings == null || !allBookings.Any())
            {
                return NotFound("No events found to delete.");
            }

            _context.Bookings.RemoveRange(allBookings);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"An error occurred while deleting events: {ex.Message}");
            }

            return Ok("All events have been deleted successfully.");
        }

    }
}
