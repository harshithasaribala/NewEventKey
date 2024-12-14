using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventKey_1.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateSaved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SavedEvent",
                columns: table => new
                {
                    SavedEventId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    TicketPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedEvent", x => x.SavedEventId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedEvent");
        }
    }
}
