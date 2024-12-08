using System;

public class Comment
{
    public int Id { get; set; }
    public required string Content { get; set; } // Required property
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
