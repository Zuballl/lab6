using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TicketController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public TicketController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // GET: api/ticket - Pobierz wszystkie zgłoszenia
    [HttpGet]
    public async Task<IActionResult> GetAllTickets()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Comments) // Pobierz również komentarze
            .ToListAsync();
        return Ok(tickets);
    }

    // GET: api/ticket/{id} - Pobierz zgłoszenie po ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicketById(int id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Comments) // Pobierz również komentarze
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound(new { Message = "Ticket not found" });

        return Ok(ticket);
    }


    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] Ticket ticket)
    {
        if (ticket == null)
            return BadRequest(new { Message = "Invalid ticket data" });

        ticket.CreatedAt = DateTime.Now;
        ticket.UpdatedAt = DateTime.Now;
        ticket.Status = "Open";

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        // Powiadom klientów o nowym zgłoszeniu
        await _hubContext.Clients.All.SendAsync("ReceiveNewTicket", ticket);

        return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, ticket);
    }


    // PUT: api/ticket/{id}/status - Aktualizacja statusu zgłoszenia
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] string newStatus)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { Message = "Ticket not found" });

        ticket.Status = newStatus;
        ticket.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        // Powiadom klientów o zmianie statusu
        await _hubContext.Clients.All.SendAsync("ReceiveStatusChange", ticket.Id, newStatus);

        return Ok(ticket);
    }

    // DELETE: api/ticket/{id} - Usuń zgłoszenie
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { Message = "Ticket not found" });

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/ticket/{id}/comments - Dodawanie komentarza do zgłoszenia
    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddCommentToTicket(int id, [FromBody] Comment comment)
    {
        if (string.IsNullOrWhiteSpace(comment.Content))
            return BadRequest(new { Message = "Comment content cannot be empty." });

        var ticket = await _context.Tickets
            .Include(t => t.Comments)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound(new { Message = "Ticket not found" });

        comment.CreatedAt = DateTime.Now;
        ticket.Comments.Add(comment);
        ticket.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        // Powiadom klientów o nowym komentarzu
        await _hubContext.Clients.All.SendAsync("ReceiveNewComment", ticket.Id, comment);

        return Ok(ticket);
    }

    // PUT: api/ticket/{id} - Aktualizacja pełnych danych zgłoszenia
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFullTicket(int id, [FromBody] Ticket updatedTicket)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { Message = "Ticket not found" });

        ticket.Title = updatedTicket.Title;
        ticket.Description = updatedTicket.Description;
        ticket.Priority = updatedTicket.Priority;
        ticket.Status = updatedTicket.Status;
        ticket.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        // Powiadom klientów o aktualizacji zgłoszenia
        await _hubContext.Clients.All.SendAsync("ReceiveFullTicketUpdate", ticket);

        return Ok(ticket);
    }
}
