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

        // GET: api/Events/by-emId/{emId}
        [HttpGet("by-emId/{emId}")]
        public async Task<ActionResult<IEnumerable<Events>>> GetEventsByEmId(string emId)
        {
            var events = await _context.Events
                .Where(e => e.EMId == emId) // Assuming EmId is the property to filter events
                .ToListAsync();

            if (events == null || !events.Any())
            {
                return NotFound("No events found for the specified Event Manager.");
            }

            return Ok(events);
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

        [HttpPost("register")]
        public async Task<IActionResult> RegisterTickets([FromBody] TicketBookingRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.EventId) || request.NumberOfTickets <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            var eventObj = await _context.Events.FirstOrDefaultAsync(e => e.EventId == request.EventId);

            if (eventObj == null)
            {
                return NotFound("Event not found.");
            }

            // Check ticket availability
            if (eventObj.RegisteredAttendees + request.NumberOfTickets > eventObj.MaxAttendees)
            {
                return BadRequest("Not enough tickets available.");
            }

            // Update registered count
            eventObj.RegisteredAttendees += request.NumberOfTickets;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while updating the event. Details: " + ex.Message);
            }

            return Ok(new
            {
                EventId = eventObj.EventId,
                EventName = eventObj.EventName,
                MaxAttendees = eventObj.MaxAttendees,
                RegisteredCount = eventObj.RegisteredAttendees,
                AvailableTickets = eventObj.MaxAttendees - eventObj.RegisteredAttendees
            });
        }

        public class TicketBookingRequest
        {
            public string EventId { get; set; }
            public int NumberOfTickets { get; set; }
        }

        // POST: api/Events/save
        [HttpPost("save")]
        public async Task<IActionResult> SaveEvent([FromBody] SaveEventRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.EventId))
            {
                return BadRequest("Invalid request data.");
            }

            // Check if the event exists
            var eventObj = await _context.Events.FirstOrDefaultAsync(e => e.EventId == request.EventId);
            if (eventObj == null)
            {
                return NotFound("Event not found.");
            }

            // Check if the event is already saved by the user
            var existingSavedEvent = await _context.SavedEvent
                .FirstOrDefaultAsync(se => se.UserId == request.UserId && se.EventId == request.EventId);

            if (existingSavedEvent != null)
            {
                return BadRequest("Event is already saved.");
            }

            // Create a new saved event record with additional event details
            var savedEvent = new SavedEvent
            {
                UserId = request.UserId,
                EventId = request.EventId,
                EventName = eventObj.EventName,
                EventDate = eventObj.EventDate,
                EventTime = eventObj.EventTime,
                TicketPrice = eventObj.TicketPrice
            };

            // Add the saved event to the database
            _context.SavedEvent.Add(savedEvent);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Event saved successfully.",
                SavedEventId = savedEvent.SavedEventId,
                EventId = savedEvent.EventId,
                UserId = savedEvent.UserId,
                EventName = savedEvent.EventName,
                EventDate = savedEvent.EventDate,
                EventTime = savedEvent.EventTime,
                TicketPrice = savedEvent.TicketPrice
            });
        }

        public class SaveEventRequest
        {
            public required string UserId { get; set; } // The user saving the event
            public required string EventId { get; set; } // The event being saved
        }

        [HttpGet("saved/{userId}")]
        public async Task<ActionResult<IEnumerable<SavedEvent>>> GetSavedEvents(string userId)
        {
            var savedEvents = await _context.SavedEvent
                .Where(se => se.UserId == userId)
                .ToListAsync();

            if (savedEvents == null || !savedEvents.Any())
            {
                return NotFound("No saved events found.");
            }

            return Ok(savedEvents);
        }

        [HttpDelete("saved/{userId}/{eventId}")]
        public async Task<IActionResult> RemoveSavedEvent(string userId, string eventId)
        {
            var savedEvent = await _context.SavedEvent
                .FirstOrDefaultAsync(e => e.UserId == userId && e.EventId == eventId);

            if (savedEvent == null)
            {
                return NotFound("Event not found.");
            }

            _context.SavedEvent.Remove(savedEvent);
            await _context.SaveChangesAsync();

            return NoContent(); // HTTP 204
        }
    }
}
