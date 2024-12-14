using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventKey_1.Server.Migrations
{
    /// <inheritdoc />
    public partial class Eventsdetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EventTime",
                table: "Events",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventTime",
                table: "Events");
        }
    }
}
