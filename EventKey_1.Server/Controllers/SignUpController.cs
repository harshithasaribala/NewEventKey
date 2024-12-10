using Microsoft.AspNetCore.Mvc;
using EventKey_1.Server.Models;
using Microsoft.EntityFrameworkCore;
using EventKey_1.Server.Infrastructure;

namespace EventKey_1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAccounts([FromQuery] string userType = null)
        {
            if (userType == "User")
            {
                var users = await _context.User.ToListAsync();
                return Ok(users);
            }
            else if (userType == "EventManager")
            {
                var eventManagers = await _context.EventManager.ToListAsync();
                return Ok(eventManagers);
            }
            else
            {
                return BadRequest("Invalid UserType. Use 'User' or 'EventManager'.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _context.User.FindAsync(id);
            if (user != null) return Ok(user);

            var eventManager = await _context.EventManager.FindAsync(id);
            if (eventManager != null) return Ok(eventManager);

            return NotFound("No record found with the specified ID.");
        }

        // Add new account
        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] SignUpViewModel model)
        {
            if (model.UserType == "User")
            {
                var user = new User
                {
                    FullName = model.FullName,
                    Age = model.Age,
                    Gender = model.Gender,
                    Email = model.Email,
                    Password = model.Password,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address
                };

                _context.User.Add(user);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            else if (model.UserType == "EventManager")
            {
                var eventManager = new EventManager
                {
                    FullName = model.FullName,
                    Age = model.Age,
                    Gender = model.Gender,
                    CompanyName = model.CompanyName,
                    EventType = model.EventType,
                    Email = model.Email,
                    Password = model.Password,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address
                };

                _context.EventManager.Add(eventManager);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = eventManager.EmId }, eventManager);
            }
            else
            {
                return BadRequest("Invalid UserType. Use 'User' or 'EventManager'.");
            }
        }

        // Update account
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(string id, [FromBody] SignUpViewModel model)
        {
            if (model.UserType == "User")
            {
                var user = await _context.User.FindAsync(id);
                if (user == null) return NotFound("User not found.");

                user.FullName = model.FullName;
                user.Age = model.Age;
                user.Gender = model.Gender;
                user.Email = model.Email;
                user.Password = model.Password;
                user.PhoneNumber = model.PhoneNumber;
                user.Address = model.Address;

                _context.User.Update(user);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else if (model.UserType == "EventManager")
            {
                var eventManager = await _context.EventManager.FindAsync(id);
                if (eventManager == null) return NotFound("Event Manager not found.");

                eventManager.FullName = model.FullName;
                eventManager.Age = model.Age;
                eventManager.Gender = model.Gender;
                eventManager.CompanyName = model.CompanyName;
                eventManager.EventType = model.EventType;
                eventManager.Email = model.Email;
                eventManager.Password = model.Password;
                eventManager.PhoneNumber = model.PhoneNumber;
                eventManager.Address = model.Address;

                _context.EventManager.Update(eventManager);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return BadRequest("Invalid UserType. Use 'User' or 'EventManager'.");
            }
        }

        // Delete by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(string id, [FromQuery] string userType)
        {
            if (userType == "User")
            {
                var user = await _context.User.FindAsync(id);
                if (user == null) return NotFound("User not found.");

                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else if (userType == "EventManager")
            {
                var eventManager = await _context.EventManager.FindAsync(id);
                if (eventManager == null) return NotFound("Event Manager not found.");

                _context.EventManager.Remove(eventManager);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return BadRequest("Invalid UserType. Use 'User' or 'EventManager'.");
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            if (model.UserType == "User")
            {
                // Login as User using Email and Password
                var user = await _context.User.FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);
                if (user != null)
                {
                    return Ok(new
                    {
                        Message = "Login successful as User",
                        UserDetails = user 
                    });
                }
                else
                {
                    return Unauthorized("Invalid Email or Password.");
                }
            }
            else if (model.UserType == "EventManager")
            {
                // Login as Event Manager using Email and Password
                var eventManager = await _context.EventManager.FirstOrDefaultAsync(em => em.Email == model.Email && em.Password == model.Password);
                if (eventManager != null)
                {
                    return Ok(new
                    {
                        Message = "Login successful as Event Manager",
                        EventManagerDetails = eventManager // Returning the entire EventManager object
                    });
                }
                else
                {
                    return Unauthorized("Invalid Email or Password.");
                }
            }
            else
            {
                return BadRequest("Invalid UserType. Use 'User' or 'EventManager'.");
            }
        }


    }
}
