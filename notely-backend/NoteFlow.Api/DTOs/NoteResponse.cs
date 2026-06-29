namespace NoteFlow.Api.DTOs;

public class NoteResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Color { get; set; } = string.Empty;

    public string Emote { get; set; } = "📝";

    public bool IsPinned { get; set; }

    public bool IsArchived { get; set; }

    public bool IsShared { get; set; }

    public string? ShareToken { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}