using System;
using System.Collections.Generic;

public class Ticket
{
    public int Id { get; set; }
    public required string Title { get; set; } // Required property
    public required string Description { get; set; } // Required property
    public required string Priority { get; set; } // Required property
    public string Status { get; set; } = "Open";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public List<Comment> Comments { get; set; } = new List<Comment>();
}
