using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LabourLinkAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedLookupValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "lookup_values",
                columns: table => new
                {
                    LookupId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Category = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lookup_values", x => x.LookupId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "lookup_values",
                columns: new[] { "LookupId", "Category", "Name", "Value" },
                values: new object[,]
                {
                    { 1, "UserRole", "Worker", 1 },
                    { 2, "UserRole", "JobSeeker", 2 },
                    { 3, "UserRole", "RecruitmentAgency", 3 },
                    { 4, "UserRole", "Administrator", 4 },
                    { 5, "UserStatus", "Active", 1 },
                    { 6, "UserStatus", "Inactive", 2 },
                    { 7, "UserStatus", "Suspended", 3 },
                    { 8, "UserStatus", "Banned", 4 },
                    { 9, "Gender", "Male", 1 },
                    { 10, "Gender", "Female", 2 },
                    { 11, "Gender", "Other", 3 },
                    { 12, "VerificationStatus", "Pending", 1 },
                    { 13, "VerificationStatus", "Verified", 2 },
                    { 14, "VerificationStatus", "Rejected", 3 },
                    { 15, "EmploymentType", "FullTime", 1 },
                    { 16, "EmploymentType", "PartTime", 2 },
                    { 17, "EmploymentType", "Contract", 3 },
                    { 18, "EmploymentType", "Seasonal", 4 },
                    { 19, "EducationLevel", "Primary", 1 },
                    { 20, "EducationLevel", "Secondary", 2 },
                    { 21, "EducationLevel", "Diploma", 3 },
                    { 22, "EducationLevel", "Degree", 4 },
                    { 23, "EducationLevel", "Masters", 5 },
                    { 24, "EducationLevel", "PhD", 6 },
                    { 25, "JobStatus", "Draft", 1 },
                    { 26, "JobStatus", "Published", 2 },
                    { 27, "JobStatus", "Closed", 3 },
                    { 28, "JobStatus", "Expired", 4 },
                    { 29, "ComplaintStatus", "Submitted", 1 },
                    { 30, "ComplaintStatus", "UnderReview", 2 },
                    { 31, "ComplaintStatus", "InProgress", 3 },
                    { 32, "ComplaintStatus", "Resolved", 4 },
                    { 33, "ComplaintStatus", "Closed", 5 },
                    { 34, "ComplaintStatus", "Rejected", 6 },
                    { 35, "ComplaintType", "SalaryDispute", 1 },
                    { 36, "ComplaintType", "UnsafeConditions", 2 },
                    { 37, "ComplaintType", "HealthConcern", 3 },
                    { 38, "ComplaintType", "LivingFacilities", 4 },
                    { 39, "ComplaintType", "Harassment", 5 },
                    { 40, "ComplaintType", "Other", 6 },
                    { 41, "ApplicationStatus", "Pending", 1 },
                    { 42, "ApplicationStatus", "UnderReview", 2 },
                    { 43, "ApplicationStatus", "Shortlisted", 3 },
                    { 44, "ApplicationStatus", "Rejected", 4 },
                    { 45, "ApplicationStatus", "Accepted", 5 },
                    { 46, "ApplicationStatus", "Withdrawn", 6 },
                    { 47, "NewsCategory", "Alert", 1 },
                    { 48, "NewsCategory", "Update", 2 },
                    { 49, "NewsCategory", "Opportunity", 3 },
                    { 50, "NewsCategory", "Regulation", 4 },
                    { 51, "Priority", "Low", 1 },
                    { 52, "Priority", "Medium", 2 },
                    { 53, "Priority", "High", 3 },
                    { 54, "Priority", "Critical", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_lookup_values_Category_Value",
                table: "lookup_values",
                columns: new[] { "Category", "Value" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lookup_values");
        }
    }
}
