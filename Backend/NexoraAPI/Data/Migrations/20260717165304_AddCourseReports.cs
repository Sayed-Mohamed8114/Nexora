using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexoraAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CodeModule = table.Column<string>(type: "varchar(45)", nullable: false),
                    CodePresentation = table.Column<string>(type: "varchar(45)", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseReports_courses_CodeModule_CodePresentation",
                        columns: x => new { x.CodeModule, x.CodePresentation },
                        principalTable: "courses",
                        principalColumns: new[] { "code_module", "code_presentation" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseReports_CodeModule_CodePresentation",
                table: "CourseReports",
                columns: new[] { "CodeModule", "CodePresentation" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseReports");
        }
    }
}
