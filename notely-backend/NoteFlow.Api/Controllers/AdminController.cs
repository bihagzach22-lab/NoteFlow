using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoteFlow.Api.Data;

namespace NoteFlow.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalNotes = await _db.Notes.CountAsync();
        var pinnedNotes = await _db.Notes.CountAsync(n => n.IsPinned);
        var archivedNotes = await _db.Notes.CountAsync(n => n.IsArchived);

        return Ok(new
        {
            totalUsers,
            totalNotes,
            pinnedNotes,
            archivedNotes
        });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _db.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.CreatedAt,
                noteCount = u.Notes.Count
            })
            .ToListAsync();

        return Ok(users);
    }
}