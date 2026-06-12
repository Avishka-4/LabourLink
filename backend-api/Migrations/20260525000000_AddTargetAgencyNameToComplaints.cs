using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabourLinkAPI.Migrations
{
    public partial class AddTargetAgencyNameToComplaints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE worker_complaints ADD COLUMN IF NOT EXISTS TargetAgencyName varchar(255) NULL;"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE worker_complaints DROP COLUMN IF EXISTS TargetAgencyName;"
            );
        }
    }
}
