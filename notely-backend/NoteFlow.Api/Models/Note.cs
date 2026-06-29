using System.ComponentModel.DataAnnotations;

namespace NoteFlow.Api.Models;

public class Note
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User? User { get; set; }

    [Required]
    [MaxLength(160)]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    [MaxLength(80)]
    public string Category { get; set; } = "General";

    [MaxLength(40)]
    public string Color { get; set; } = "default";

    [MaxLength(20)]
    public string Emote { get; set; } = "📝";

    public bool IsPinned { get; set; } = false;

    public bool IsArchived { get; set; } = false;

    public bool IsShared { get; set; } = false;

    [MaxLength(80)]
    public string? ShareToken { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}