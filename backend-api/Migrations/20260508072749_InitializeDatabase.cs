using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace LabourLinkAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitializeDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    FirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    IsPhoneVerified = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.UserId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    LogId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Action = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    EntityType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EntityId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    OldValues = table.Column<string>(type: "json", nullable: true),
                    NewValues = table.Column<string>(type: "json", nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_audit_logs_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "job_seekers",
                columns: table => new
                {
                    JobSeekerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    EducationLevel = table.Column<int>(type: "int", nullable: false),
                    Qualification = table.Column<string>(type: "longtext", nullable: false),
                    DesiredJobRole = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    DesiredLocation = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    ExpectedSalary = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    IsAvailable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AvailabilityDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Languages = table.Column<string>(type: "json", nullable: false),
                    Certifications = table.Column<string>(type: "json", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_seekers", x => x.JobSeekerId);
                    table.ForeignKey(
                        name: "FK_job_seekers_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "news",
                columns: table => new
                {
                    NewsId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CreatedByAdminId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    FeaturedImageUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    IsPublished = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ViewCount = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_news", x => x.NewsId);
                    table.ForeignKey(
                        name: "FK_news_users_CreatedByAdminId",
                        column: x => x.CreatedByAdminId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "recruitment_agencies",
                columns: table => new
                {
                    AgencyId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    CompanyName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    CompanyRegistrationNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    LicenseNumber = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    VerificationStatus = table.Column<int>(type: "int", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    VerifiedBy = table.Column<Guid>(type: "char(36)", nullable: true),
                    BusinessAddress = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    WebsiteUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    NumberOfEmployees = table.Column<int>(type: "int", nullable: true),
                    EstablishedYear = table.Column<int>(type: "int", nullable: true),
                    TaxId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    BankAccount = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    OperatingCountries = table.Column<string>(type: "json", nullable: false),
                    Certifications = table.Column<string>(type: "json", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recruitment_agencies", x => x.AgencyId);
                    table.ForeignKey(
                        name: "FK_recruitment_agencies_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_recruitment_agencies_users_VerifiedBy",
                        column: x => x.VerifiedBy,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "refresh_tokens",
                columns: table => new
                {
                    TokenId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Token = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.TokenId);
                    table.ForeignKey(
                        name: "FK_refresh_tokens_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "workers",
                columns: table => new
                {
                    WorkerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    WorkerRegistrationNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Nationality = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    PassportNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    CurrentLocation = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    DesiredLocation = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    Skills = table.Column<string>(type: "json", nullable: false),
                    VerificationStatus = table.Column<int>(type: "int", nullable: false),
                    VerifiedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    VerifiedBy = table.Column<Guid>(type: "char(36)", nullable: true),
                    EmergencyContactName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    EmergencyContactPhone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workers", x => x.WorkerId);
                    table.ForeignKey(
                        name: "FK_workers_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_workers_users_VerifiedBy",
                        column: x => x.VerifiedBy,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "job_postings",
                columns: table => new
                {
                    JobId = table.Column<Guid>(type: "char(36)", nullable: false),
                    AgencyId = table.Column<Guid>(type: "char(36)", nullable: false),
                    JobTitle = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    JobDescription = table.Column<string>(type: "longtext", nullable: false),
                    JobCategory = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EmploymentType = table.Column<int>(type: "int", nullable: false),
                    Location = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Country = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    SalaryMin = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    SalaryMax = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    SalaryCurrency = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true),
                    Requirements = table.Column<string>(type: "json", nullable: false),
                    RequiredExperience = table.Column<int>(type: "int", nullable: true),
                    EducationRequired = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    ApplicationDeadline = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false),
                    ApplyCount = table.Column<int>(type: "int", nullable: false),
                    IsFeatured = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FeaturedUntil = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PostedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_postings", x => x.JobId);
                    table.ForeignKey(
                        name: "FK_job_postings_recruitment_agencies_AgencyId",
                        column: x => x.AgencyId,
                        principalTable: "recruitment_agencies",
                        principalColumn: "AgencyId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "worker_complaints",
                columns: table => new
                {
                    ComplaintId = table.Column<Guid>(type: "char(36)", nullable: false),
                    WorkerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ComplaintType = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
                    AttachmentUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    AssignedToAdminId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "longtext", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_worker_complaints", x => x.ComplaintId);
                    table.ForeignKey(
                        name: "FK_worker_complaints_users_AssignedToAdminId",
                        column: x => x.AssignedToAdminId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_worker_complaints_workers_WorkerId",
                        column: x => x.WorkerId,
                        principalTable: "workers",
                        principalColumn: "WorkerId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "job_applications",
                columns: table => new
                {
                    ApplicationId = table.Column<Guid>(type: "char(36)", nullable: false),
                    JobId = table.Column<Guid>(type: "char(36)", nullable: false),
                    JobSeekerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    WorkerId = table.Column<Guid>(type: "char(36)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CoverLetter = table.Column<string>(type: "longtext", nullable: true),
                    ResumeUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    AppliedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReviewedBy = table.Column<Guid>(type: "char(36)", nullable: true),
                    RejectionReason = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comments = table.Column<string>(type: "longtext", nullable: true),
                    InterviewDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    InterviewLocation = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_applications", x => x.ApplicationId);
                    table.ForeignKey(
                        name: "FK_job_applications_job_postings_JobId",
                        column: x => x.JobId,
                        principalTable: "job_postings",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_job_applications_job_seekers_JobSeekerId",
                        column: x => x.JobSeekerId,
                        principalTable: "job_seekers",
                        principalColumn: "JobSeekerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_job_applications_users_ReviewedBy",
                        column: x => x.ReviewedBy,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_job_applications_workers_WorkerId",
                        column: x => x.WorkerId,
                        principalTable: "workers",
                        principalColumn: "WorkerId",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_CreatedAt",
                table: "audit_logs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_UserId",
                table: "audit_logs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_job_applications_JobId",
                table: "job_applications",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_job_applications_JobSeekerId",
                table: "job_applications",
                column: "JobSeekerId");

            migrationBuilder.CreateIndex(
                name: "IX_job_applications_ReviewedBy",
                table: "job_applications",
                column: "ReviewedBy");

            migrationBuilder.CreateIndex(
                name: "IX_job_applications_Status",
                table: "job_applications",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_job_applications_WorkerId",
                table: "job_applications",
                column: "WorkerId");

            migrationBuilder.CreateIndex(
                name: "IX_job_postings_AgencyId",
                table: "job_postings",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_job_postings_Location",
                table: "job_postings",
                column: "Location");

            migrationBuilder.CreateIndex(
                name: "IX_job_postings_Status",
                table: "job_postings",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_job_seekers_UserId",
                table: "job_seekers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_news_Category",
                table: "news",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_news_CreatedByAdminId",
                table: "news",
                column: "CreatedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_news_IsPublished",
                table: "news",
                column: "IsPublished");

            migrationBuilder.CreateIndex(
                name: "IX_recruitment_agencies_CompanyRegistrationNumber",
                table: "recruitment_agencies",
                column: "CompanyRegistrationNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_recruitment_agencies_LicenseNumber",
                table: "recruitment_agencies",
                column: "LicenseNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_recruitment_agencies_UserId",
                table: "recruitment_agencies",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_recruitment_agencies_VerifiedBy",
                table: "recruitment_agencies",
                column: "VerifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_Token",
                table: "refresh_tokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_UserId",
                table: "refresh_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_worker_complaints_AssignedToAdminId",
                table: "worker_complaints",
                column: "AssignedToAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_worker_complaints_Priority",
                table: "worker_complaints",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_worker_complaints_Status",
                table: "worker_complaints",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_worker_complaints_WorkerId",
                table: "worker_complaints",
                column: "WorkerId");

            migrationBuilder.CreateIndex(
                name: "IX_workers_PassportNumber",
                table: "workers",
                column: "PassportNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_workers_UserId",
                table: "workers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_workers_VerifiedBy",
                table: "workers",
                column: "VerifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_workers_WorkerRegistrationNumber",
                table: "workers",
                column: "WorkerRegistrationNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "job_applications");

            migrationBuilder.DropTable(
                name: "news");

            migrationBuilder.DropTable(
                name: "refresh_tokens");

            migrationBuilder.DropTable(
                name: "worker_complaints");

            migrationBuilder.DropTable(
                name: "job_postings");

            migrationBuilder.DropTable(
                name: "job_seekers");

            migrationBuilder.DropTable(
                name: "workers");

            migrationBuilder.DropTable(
                name: "recruitment_agencies");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
