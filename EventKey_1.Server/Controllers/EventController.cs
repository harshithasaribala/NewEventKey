using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EventKey_1.Server.Models;
using EventKey_1.Server.Infrastructure;

namespace EventKey_1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly DataContext _context;

        public EventsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Events>>> GetEvents()
        {
            // Fetch events without including EventManager
            return await _context.Events.ToListAsync();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Events>> GetEvent(string id)
        {
            var eventObj = await _context.Events.FirstOrDefaultAsync(e => e.EventId == id);

            if (eventObj == null)
            {
                return NotFound();
            }

            return eventObj;
        }

        // POST: api/Events
        [HttpPost]
        public async Task<ActionResult<Events>> PostEvent(Events eventObj)
        {
            _context.Events.Add(eventObj);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEvent", new { id = eventObj.EventId }, eventObj);
        }

        // PUT: api/Events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(string id, Events eventObj)
        {
            if (id != eventObj.EventId)
            {
                return BadRequest();
            }

            _context.Entry(eventObj).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            var eventObj = await _context.Events.FindAsync(id);
            if (eventObj == null)
            {
                return NotFound();
            }

            _context.Events.Remove(eventObj);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(string id)
        {
            return _context.Events.Any(e => e.EventId == id);
        }
    }
}
