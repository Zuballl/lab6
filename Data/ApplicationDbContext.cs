using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Ticket> Tickets { get; set; } // Tabela dla zgłoszeń
    public DbSet<Comment> Comments { get; set; } // Tabela dla komentarzy
}
