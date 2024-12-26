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
        public DbSet<Bookings> Bookings { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<SavedEvent> SavedEvent { get; set; }
        public DbSet<UserInsights> UserInsights { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Bookings>(entity =>
            {
                entity.Property(b => b.TicketPrice)
                    .HasColumnType("decimal(18, 2)")
                    .HasPrecision(18, 2); // Optional but clearer.

                entity.Property(b => b.TotalAmount)
                    .HasColumnType("decimal(18, 2)")
                    .HasPrecision(18, 2); // Optional but clearer.
            });

            modelBuilder.Entity<SavedEvent>()
                .Property(e => e.TicketPrice)
                .HasColumnType("decimal(18,2)");
           
        }
    }
}
