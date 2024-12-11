using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventKey_1.Server.Migrations
{
    /// <inheritdoc />
    public partial class Evntss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_EventManager_EMId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_EMId",
                table: "Events");

            migrationBuilder.AlterColumn<string>(
                name: "EMId",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
