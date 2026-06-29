using Microsoft.EntityFrameworkCore;
using NoteFlow.Api.Models;

namespace NoteFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Note> Notes => Set<Note>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasIndex(u => u.Email)
                .IsUnique();


            entity.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(180);

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(30);

        });

        modelBuilder.Entity<Note>(entity =>
        {
            entity.ToTable("Notes");

            entity.Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(160);

            entity.Property(n => n.Category)
                .HasMaxLength(80);

            entity.Property(n => n.Color)
                .HasMaxLength(40);

            entity.Property(n => n.Emote)
                .HasMaxLength(20)
                .HasDefaultValue("📝");

            entity.Property(n => n.IsShared)
                .HasDefaultValue(false);

            entity.Property(n => n.ShareToken)
                .HasMaxLength(80);

            entity.HasIndex(n => n.ShareToken)
                .IsUnique()
                .HasFilter("\"ShareToken\" IS NOT NULL");

            entity.HasOne(n => n.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}