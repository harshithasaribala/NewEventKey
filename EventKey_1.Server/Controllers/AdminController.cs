using EventKey_1.Server.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventKey_1.Server.Controllers
{
    // AdminController.cs
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;

        public AdminController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Admin/RegisteredUsersCount
        [HttpGet("RegisteredUsersCount")]
        public async Task<ActionResult<int>> GetRegisteredUsersCount()
        {
            var userCount = await _context.User.CountAsync();
            return Ok(userCount);
        }

        // GET: api/Admin/RegisteredEventManagersCount
        [HttpGet("RegisteredEventManagersCount")]
        public async Task<ActionResult<int>> GetRegisteredEventManagersCount()
        {
            var eventManagerCount = await _context.EventManager.CountAsync();
            return Ok(eventManagerCount);
        }
        [HttpGet("booking-info")]
        public async Task<IActionResult> GetBookingInfo()
        {
            var bookingData = await _context.Bookings
                .GroupBy(b => b.EventId) 
                .Select(g => new
                {
                    EventName = g.Key,
                    BookingsCount = g.Count()
                })
                .ToListAsync();

            return Ok(bookingData);
        }
    }

}
