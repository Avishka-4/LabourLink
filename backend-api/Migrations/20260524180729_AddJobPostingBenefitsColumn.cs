using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabourLinkAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddJobPostingBenefitsColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS Benefits json DEFAULT (JSON_ARRAY());"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE job_postings DROP COLUMN IF EXISTS Benefits;"
            );
        }
    }
}