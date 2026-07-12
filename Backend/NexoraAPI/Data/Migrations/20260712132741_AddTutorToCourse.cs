using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexoraAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTutorToCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TutorId",
                table: "courses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_courses_TutorId",
                table: "courses",
                column: "TutorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Tutors",
                table: "courses",
                column: "TutorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Tutors",
                table: "courses");

            migrationBuilder.DropIndex(
                name: "IX_courses_TutorId",
                table: "courses");

            migrationBuilder.DropColumn(
                name: "TutorId",
                table: "courses");
        }
    }
}
