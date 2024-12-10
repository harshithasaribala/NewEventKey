namespace EventKey_1.Server.Models
{
    public class LoginViewModel
    {
        public string UserType { get; set; } // "User" or "EventManager"
        public string Email { get; set; } // Optional if Id is provided
        public required string Password { get; set; }
    }
}
