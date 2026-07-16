using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexoraAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStudentInfoFKFromUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_studentInfo_StudentId",
                table: "Users");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_studentInfo_id_student",
                table: "studentInfo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_studentInfo_id_student",
                table: "studentInfo",
                column: "id_student");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_studentInfo_StudentId",
                table: "Users",
                column: "StudentId",
                principalTable: "studentInfo",
                principalColumn: "id_student");
        }
    }
}
