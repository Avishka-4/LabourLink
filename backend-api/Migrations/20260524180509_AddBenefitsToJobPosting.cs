using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabourLinkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBenefitsToJobPosting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    TokenId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Token = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.TokenId);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SavedJobs",
                columns: table => new
                {
                    SavedJobId = table.Column<Guid>(type: "char(36)", nullable: false),
                    JobSeekerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    JobId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedJobs", x => x.SavedJobId);
                    table.ForeignKey(
                        name: "FK_SavedJobs_job_postings_JobId",
                        column: x => x.JobId,
                        principalTable: "job_postings",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedJobs_job_seekers_JobSeekerId",
                        column: x => x.JobSeekerId,
                        principalTable: "job_seekers",
                        principalColumn: "JobSeekerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_UserId",
                table: "PasswordResetTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedJobs_JobId",
                table: "SavedJobs",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedJobs_JobSeekerId",
                table: "SavedJobs",
                column: "JobSeekerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.DropTable(
                name: "SavedJobs");
        }
    }
}
