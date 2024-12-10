using EventKey_1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace EventKey_1.Server.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<User> User { get; set; }
        public DbSet<EventManager> EventManager { get; set; }
        public DbSet<Events> Events { get; set; }
    }
}
