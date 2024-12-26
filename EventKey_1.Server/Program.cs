using EventKey_1.Server.Infrastructure;
using EventKey_1.Server.Services;
using Microsoft.EntityFrameworkCore;

namespace EventKey_1.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddScoped<IEmailService, EmailService>();
            // Add services to the container.
            builder.Services.AddControllers();

            // Add DbContext for Entity Framework and configure SQL Server
            builder.Services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            // Add Swagger for API Documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Add CORS Policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()  // Allow any origin
                          .AllowAnyMethod()  // Allow any HTTP method
                          .AllowAnyHeader(); // Allow any headers
                });
            });

            var app = builder.Build();

            // Use CORS Policy
            app.UseCors("AllowAll");

            // Serve default files (e.g., index.html for SPA)
            app.UseDefaultFiles();
            app.UseStaticFiles(); // Serve static files from wwwroot

            // Configure the HTTP request pipeline for development environment
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Force HTTPS Redirection
            app.UseHttpsRedirection();

            // Enable Authorization (you can add authentication middleware here)
            app.UseAuthorization();

            // Map Controllers for API Endpoints
            app.MapControllers();

            // Handle Fallback for Single Page Applications (SPA)
            app.MapFallbackToFile("/index.html");

            // Run the application
            app.Run();
        }
    }
}
