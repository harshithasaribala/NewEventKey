namespace EventKey_1.Server.Services
{
    public interface IEmailService
    {
        Task SendPromotionEmailAsync(string subject, string body, List<string> recipients, string logoUrl);
    }

}
