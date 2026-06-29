using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoteFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ADD COLUMN IF NOT EXISTS "EmailConfirmed" boolean NOT NULL DEFAULT FALSE;
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ADD COLUMN IF NOT EXISTS "EmailVerificationExpiresAt" timestamp with time zone;
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ADD COLUMN IF NOT EXISTS "EmailVerificationToken" character varying(120);
            """);

            migrationBuilder.Sql("""
                CREATE INDEX IF NOT EXISTS "IX_Users_EmailVerificationToken"
                ON "Users" ("EmailVerificationToken");
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                ADD COLUMN IF NOT EXISTS "Emote" character varying(20) NOT NULL DEFAULT '📝';
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                ADD COLUMN IF NOT EXISTS "IsShared" boolean NOT NULL DEFAULT FALSE;
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                ADD COLUMN IF NOT EXISTS "ShareToken" character varying(80);
            """);

            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Notes_ShareToken"
                ON "Notes" ("ShareToken")
                WHERE "ShareToken" IS NOT NULL;
            """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_Users_EmailVerificationToken";
            """);

            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_Notes_ShareToken";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                DROP COLUMN IF EXISTS "EmailVerificationToken";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                DROP COLUMN IF EXISTS "EmailVerificationExpiresAt";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                DROP COLUMN IF EXISTS "EmailConfirmed";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                DROP COLUMN IF EXISTS "ShareToken";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                DROP COLUMN IF EXISTS "IsShared";
            """);

            migrationBuilder.Sql("""
                ALTER TABLE "Notes"
                DROP COLUMN IF EXISTS "Emote";
            """);
        }
    }
}