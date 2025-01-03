using EventKey_1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventKey_1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserInsightsController : ControllerBase
    {
        private readonly DataContext _context;

        public UserInsightsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/UserInsights
        [HttpGet]
        public async Task<IActionResult> GetAllUserInsights()
        {
            var userInsights = await _context.UserInsights
                .OrderByDescending(u => u.TotalPoints) // Order by TotalPoints for leaderboard
                .ToListAsync();

            return Ok(userInsights);
        }

        // GET: api/UserInsights/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserInsightsById(string userId)
        {
            var userInsight = await _context.UserInsights
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (userInsight == null)
            {
                return NotFound($"User insights not found for UserId: {userId}");
            }

            // Fetch top 5 users for leaderboard
            var leaderboard = await _context.UserInsights
                .OrderByDescending(u => u.TotalPoints)
                .Take(5)
                .ToListAsync();

            var result = new
            {
                userInsight.TotalBookings,
                TotalPoints = userInsight.TotalPoints,
                Rank = userInsight.Rank,
                Leaderboard = leaderboard.Select(l => new
                {
                    l.Rank,
                    l.UserId,
                    Points = l.TotalPoints
                })
            };

            return Ok(result);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteAllUserInsights()
        {
            // Remove all user insights from the database
            var userInsights = await _context.UserInsights.ToListAsync();
            _context.UserInsights.RemoveRange(userInsights);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
