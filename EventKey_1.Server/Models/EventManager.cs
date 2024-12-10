using System.ComponentModel.DataAnnotations;

namespace EventKey_1.Server.Models
{
    public class EventManager
    {
        [Key]
        [Required]
        public string EmId { get; set; } = GenerateUniqueId();
        public required string FullName { get; set; }
        public required int Age { get; set; }
        public required string Gender { get; set; }
        public required string CompanyName { get; set; }
        public required string EventType { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
        private static string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper();
        }
    }
}
