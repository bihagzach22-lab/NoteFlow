using System.ComponentModel.DataAnnotations;

namespace NoteFlow.Api.DTOs;

public class NoteCreateRequest
{
    [Required]
    [MaxLength(160)]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Category { get; set; } = "General";

    public string Color { get; set; } = "default";

    public string Emote { get; set; } = "📝";
}