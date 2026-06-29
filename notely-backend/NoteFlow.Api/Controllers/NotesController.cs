using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoteFlow.Api.Data;
using NoteFlow.Api.DTOs;
using NoteFlow.Api.Models;

namespace NoteFlow.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteResponse>>> GetNotes(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] bool includeArchived = false)
    {
        var userId = GetCurrentUserId();

        var query = _db.Notes
            .AsNoTracking()
            .Where(n => n.UserId == userId);

        if (!includeArchived)
        {
            query = query.Where(n => !n.IsArchived);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();

            query = query.Where(n =>
                n.Title.ToLower().Contains(term) ||
                n.Content.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(n => n.Category == category);
        }

        var notes = await query
            .OrderByDescending(n => n.IsPinned)
            .ThenByDescending(n => n.UpdatedAt)
            .ToListAsync();

        return Ok(notes.Select(ToResponse));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> GetNote(Guid id)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        return Ok(ToResponse(note));
    }

    [HttpPost]
    public async Task<ActionResult<NoteResponse>> CreateNote(NoteCreateRequest request)
    {
        var userId = GetCurrentUserId();

        var now = DateTime.UtcNow;


        var note = new Note
        {
            UserId = userId,
            Title = string.IsNullOrWhiteSpace(request.Title) ? "Untitled note" : request.Title.Trim(),
            Content = request.Content?.Trim() ?? string.Empty,
            Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category.Trim(),
            Color = string.IsNullOrWhiteSpace(request.Color) ? "default" : request.Color.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Notes.Add(note);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNote), new { id = note.Id }, ToResponse(note));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> UpdateNote(Guid id, NoteUpdateRequest request)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);


        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        note.Title = string.IsNullOrWhiteSpace(request.Title) ? "Untitled note" : request.Title.Trim();
        note.Content = request.Content?.Trim() ?? string.Empty;
        note.Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category.Trim();
        note.Color = string.IsNullOrWhiteSpace(request.Color) ? "default" : request.Color.Trim();
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(note));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id:guid}/pin")]
    public async Task<ActionResult<NoteResponse>> TogglePin(Guid id)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        note.IsPinned = !note.IsPinned;
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(note));
    }

    [HttpPatch("{id:guid}/archive")]
    public async Task<ActionResult<NoteResponse>> ArchiveNote(Guid id)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        note.IsArchived = true;
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(note));
    }

    [HttpPatch("{id:guid}/restore")]
    public async Task<ActionResult<NoteResponse>> RestoreNote(Guid id)
    {
        var userId = GetCurrentUserId();

        var note = await _db.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (note == null)
        {
            return NotFound(new { message = "Note not found." });
        }

        note.IsArchived = false;
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(note));
    }

    private Guid GetCurrentUserId()
    {
        var userIdText = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdText, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }

        return userId;
    }

    private static NoteResponse ToResponse(Note note)
    {
        return new NoteResponse
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            Category = note.Category,
            Color = note.Color,
            IsPinned = note.IsPinned,
            IsArchived = note.IsArchived,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        };
    }
}