using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexoraAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeAssessmentIdAutoIncrement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // SQL Server cannot add IDENTITY to an existing column via ALTER COLUMN.
            // We must drop all FK constraints referencing the PK, recreate the column as IDENTITY, then restore FKs.
            migrationBuilder.Sql(@"
                -- Drop FK from studentAssessment referencing assessments.id_assessment
                IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK__studentAs__id_as__4316F928')
                    ALTER TABLE [studentAssessment] DROP CONSTRAINT [FK__studentAs__id_as__4316F928];

                -- Drop FK from AssessmentQuestions referencing assessments.id_assessment
                IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_AssessmentQuestions_assessments_AssessmentId')
                    ALTER TABLE [AssessmentQuestions] DROP CONSTRAINT [FK_AssessmentQuestions_assessments_AssessmentId];

                -- Drop PK constraint
                IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'PK__assessme__0A74B8277284752F')
                    ALTER TABLE [assessments] DROP CONSTRAINT [PK__assessme__0A74B8277284752F];

                -- Drop old column and add as IDENTITY
                ALTER TABLE [assessments] DROP COLUMN [id_assessment];
                ALTER TABLE [assessments] ADD [id_assessment] INT IDENTITY(1,1) NOT NULL;

                -- Re-add PK
                ALTER TABLE [assessments] ADD CONSTRAINT [PK__assessme__0A74B8277284752F] PRIMARY KEY ([id_assessment]);

                -- Re-add FK on studentAssessment
                ALTER TABLE [studentAssessment]
                    ADD CONSTRAINT [FK__studentAs__id_as__4316F928]
                    FOREIGN KEY ([id_assessment]) REFERENCES [assessments]([id_assessment]);

                -- Re-add FK on AssessmentQuestions
                ALTER TABLE [AssessmentQuestions]
                    ADD CONSTRAINT [FK_AssessmentQuestions_assessments_AssessmentId]
                    FOREIGN KEY ([AssessmentId]) REFERENCES [assessments]([id_assessment]) ON DELETE CASCADE;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverting IDENTITY is not supported without data loss; this is intentionally left as no-op.
            // To undo, manually recreate the column without IDENTITY.
        }
    }
}
