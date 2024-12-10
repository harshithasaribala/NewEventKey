using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EventKey_1.Server.Models;
using Microsoft.AspNetCore.Http;
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
            return await _context.Events.Include(e => e.EventManager).ToListAsync();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Events>> GetEvent(string id)
        {
            var eventObj = await _context.Events.Include(e => e.EventManager).FirstOrDefaultAsync(e => e.EventId == id);

            if (eventObj == null)
            {
                return NotFound();
            }

            return eventObj;
        }

        // GET: api/Events/ByEventManager/{emid}
        [HttpGet("ByEventManager/{emid}")]
        public async Task<ActionResult<IEnumerable<Events>>> GetEventsByEMId(string emid)
        {
            var events = await _context.Events
                .Include(e => e.EventManager)
                .Where(e => e.EMId == emid)
                .ToListAsync();

            if (events == null || events.Count == 0)
            {
                return NotFound(new { message = "No events found for this Event Manager." });
            }

            return events;
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

        // PUT: api/Events/ByEventManager/{emid}
        [HttpPut("ByEventManager/{emid}")]
        public async Task<IActionResult> UpdateEventsByEMId(string emid, Events eventObj)
        {
            var events = await _context.Events.Where(e => e.EMId == emid).ToListAsync();

            if (events == null || events.Count == 0)
            {
                return NotFound(new { message = "No events found for this Event Manager to update." });
            }

            foreach (var ev in events)
            {
                // Update the event's details here. Example:
                ev.EventName = eventObj.EventName;
                ev.Location = eventObj.Location;
                ev.EventDate = eventObj.EventDate;
                ev.Description = eventObj.Description;
                ev.TicketPrice = eventObj.TicketPrice;
                ev.MaxAttendees = eventObj.MaxAttendees;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(string id)
        {
            return _context.Events.Any(e => e.EventId == id);
        }
    }
}
