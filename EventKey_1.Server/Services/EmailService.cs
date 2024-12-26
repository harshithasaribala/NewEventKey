using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace EventKey_1.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpServer = "smtp.gmail.com"; // SMTP server for Gmail
        private readonly int _smtpPort = 587; // SMTP port (587 for TLS)
        private readonly string _smtpUser = "eventkey.ad@gmail.com"; // Your email
        private readonly string _smtpPassword = "pfwyyxwqarwpxtkv"; // Your email password or App password
        private readonly string _fromEmail = "eventkey.ad@gmail.com"; // Email sender address

        public async Task SendPromotionEmailAsync(string subject, string body, List<string> recipients, string logoUrl)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("EventKey", _fromEmail));

            // Add recipients
            foreach (var recipient in recipients)
            {
                message.To.Add(new MailboxAddress("Users", recipient));
            }

            message.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = body;

            var logoPath = Path.Combine("wwwroot", logoUrl); // Assuming logo is in a public folder like wwwroot
            if (File.Exists(logoPath))
            {
                var logo = new MimePart("image", "jpeg")
                {
                    Content = new MimeContent(File.OpenRead(logoPath)),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Inline),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = "logo.jpg",
                    ContentId = "<logo>" // CID to be referenced in HTML
                };

                bodyBuilder.Attachments.Add(logo);
            }
            else
            {
                // Handle case where logo is not found
                bodyBuilder.TextBody += "\n\n[Logo not found]";
            }

            // Set the HTML body with an image referenced by CID
            bodyBuilder.HtmlBody = $"<h1>{subject}</h1><p>{body}</p><img src=\"cid:logo\" />";

            message.Body = bodyBuilder.ToMessageBody();

            // Send the email using SMTP
            using (var client = new SmtpClient())
            {
                try
                {
                    Console.WriteLine("Connecting to SMTP server...");
                    await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                    Console.WriteLine("Connected to SMTP server.");

                    Console.WriteLine("Authenticating...");
                    await client.AuthenticateAsync(_smtpUser, _smtpPassword);
                    Console.WriteLine("Authentication successful.");

                    Console.WriteLine("Sending email...");
                    await client.SendAsync(message);
                    Console.WriteLine("Email sent successfully.");

                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    throw; // rethrow the exception to get more detailed stack trace if needed
                }
            }

        }
    }
}
