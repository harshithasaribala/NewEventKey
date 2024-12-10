using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventKey_1.Server.Migrations
{
    /// <inheritdoc />
    public partial class @event : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ticketPrice",
                table: "Events",
                newName: "TicketPrice");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "EventManager",
                newName: "EmId");

            migrationBuilder.AlterColumn<string>(
                name: "EMId",
                table: "Events",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Events_EMId",
                table: "Events",
                column: "EMId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_EventManager_EMId",
                table: "Events",
                column: "EMId",
                principalTable: "EventManager",
                principalColumn: "EmId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_EventManager_EMId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_EMId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "TicketPrice",
                table: "Events",
                newName: "ticketPrice");

            migrationBuilder.RenameColumn(
                name: "EmId",
                table: "EventManager",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "EMId",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
