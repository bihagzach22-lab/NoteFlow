namespace NoteFlow.Api.DTOs;

public class SharedNoteResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Color { get; set; } = string.Empty;

    public string Emote { get; set; } = "📝";

    public DateTime UpdatedAt { get; set; }
}