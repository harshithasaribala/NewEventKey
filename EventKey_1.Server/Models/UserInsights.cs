﻿using System.ComponentModel.DataAnnotations;

namespace EventKey_1.Server.Models
{
    public class UserInsights
    {
        [Key]
        public int Id { get; set; }
        
        public string UserId { get; set; }
        public int TotalBookings { get; set; }
        public int TotalPoints { get; set; }
        public int Rank { get; set; }
    }

}
