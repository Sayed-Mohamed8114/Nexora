using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexoraAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class RedesignSkillsAndAddCourseSkillTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "StudentSkills");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "StudentSkills",
                newName: "AddedAt");

            migrationBuilder.AddColumn<string>(
                name: "TargetLevel",
                table: "StudentSkills",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Beginner");

            migrationBuilder.CreateTable(
                name: "CourseSkillTags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CodeModule = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: false),
                    CodePresentation = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: false),
                    SkillName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Beginner")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseSkillTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseSkillTags_courses_CodeModule_CodePresentation",
                        columns: x => new { x.CodeModule, x.CodePresentation },
                        principalTable: "courses",
                        principalColumns: new[] { "code_module", "code_presentation" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseSkillTags_CodeModule_CodePresentation",
                table: "CourseSkillTags",
                columns: new[] { "CodeModule", "CodePresentation" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseSkillTags");

            migrationBuilder.DropColumn(
                name: "TargetLevel",
                table: "StudentSkills");

            migrationBuilder.RenameColumn(
                name: "AddedAt",
                table: "StudentSkills",
                newName: "UpdatedAt");

            migrationBuilder.AddColumn<double>(
                name: "Percentage",
                table: "StudentSkills",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
