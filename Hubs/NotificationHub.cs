using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    // Powiadomienie o nowym zgłoszeniu
    public async Task NotifyNewTicket(string title, string description)
    {
        await Clients.All.SendAsync("ReceiveNewTicket", title, description);
    }

    // Powiadomienie o zmianie stanu zgłoszenia
    public async Task NotifyStatusChange(int ticketId, string status)
    {
        await Clients.All.SendAsync("ReceiveStatusChange", ticketId, status);
    }
}
