using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NexoraAPI.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assessment> Assessments { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<StudentAssessment> StudentAssessments { get; set; }

    public virtual DbSet<StudentInfo> StudentInfos { get; set; }

    public virtual DbSet<StudentRegistration> StudentRegistrations { get; set; }

    public virtual DbSet<StudentVle> StudentVles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vle> Vles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=db58443.public.databaseasp.net; Database=db58443; User Id=db58443; Password=F@t9r5_BRx6=; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assessment>(entity =>
        {
            entity.HasKey(e => e.IdAssessment).HasName("PK__assessme__0A74B8277284752F");

            entity.ToTable("assessments");

            entity.Property(e => e.IdAssessment)
                .ValueGeneratedNever()
                .HasColumnName("id_assessment");
            entity.Property(e => e.AssessmentType)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("assessment_type");
            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
            entity.Property(e => e.Date)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("date");

            entity.HasOne(d => d.Course).WithMany(p => p.Assessments)
                .HasForeignKey(d => new { d.CodeModule, d.CodePresentation })
                .HasConstraintName("FK__assessments__398D8EEE");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => new { e.CodeModule, e.CodePresentation });

            entity.ToTable("courses");

            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
        });

        modelBuilder.Entity<StudentAssessment>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("studentAssessment");

            entity.Property(e => e.DateSubmitted).HasColumnName("date_submitted");
            entity.Property(e => e.IdAssessment).HasColumnName("id_assessment");
            entity.Property(e => e.IdStudent).HasColumnName("id_student");
            entity.Property(e => e.IsBanked).HasColumnName("is_banked");
            entity.Property(e => e.Score).HasColumnName("score");

            entity.HasOne(d => d.IdAssessmentNavigation).WithMany()
                .HasForeignKey(d => d.IdAssessment)
                .HasConstraintName("FK__studentAs__id_as__4316F928");
        });

        modelBuilder.Entity<StudentInfo>(entity =>
        {
            entity.HasKey(e => new { e.CodeModule, e.CodePresentation, e.IdStudent });

            entity.ToTable("studentInfo");

            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
            entity.Property(e => e.IdStudent).HasColumnName("id_student");
            entity.Property(e => e.AgeBand)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("age_band");
            entity.Property(e => e.Disability)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("disability");
            entity.Property(e => e.FinalResult)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("final_result");
            entity.Property(e => e.Gender)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.HighestEducation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("highest_education");
            entity.Property(e => e.ImdBand)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("imd_band");
            entity.Property(e => e.NumOfPrevAttempts).HasColumnName("num_of_prev_attempts");
            entity.Property(e => e.Region)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("region");
            entity.Property(e => e.StudiedCredits).HasColumnName("studied_credits");

            entity.HasOne(d => d.Course).WithMany(p => p.StudentInfos)
                .HasForeignKey(d => new { d.CodeModule, d.CodePresentation })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__studentInfo__3F466844");
        });

        modelBuilder.Entity<StudentRegistration>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("studentRegistration");

            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
            entity.Property(e => e.DateRegistration).HasColumnName("date_registration");
            entity.Property(e => e.DateUnregistration).HasColumnName("date_unregistration");
            entity.Property(e => e.IdStudent).HasColumnName("id_student");

            entity.HasOne(d => d.StudentInfo).WithMany()
                .HasForeignKey(d => new { d.CodeModule, d.CodePresentation, d.IdStudent })
                .HasConstraintName("FK__studentRegistrat__412EB0B6");
        });

        modelBuilder.Entity<StudentVle>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("studentVle");

            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.IdSite).HasColumnName("id_site");
            entity.Property(e => e.IdStudent).HasColumnName("id_student");
            entity.Property(e => e.SumClick).HasColumnName("sum_click");

            entity.HasOne(d => d.IdSiteNavigation).WithMany()
                .HasForeignKey(d => d.IdSite)
                .HasConstraintName("FK__studentVl__id_si__45F365D3");

            entity.HasOne(d => d.StudentInfo).WithMany()
                .HasForeignKey(d => new { d.CodeModule, d.CodePresentation, d.IdStudent })
                .HasConstraintName("FK__studentVle__44FF419A");
        });

                modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.StudentId).IsUnique();

            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne<StudentInfo>()
                .WithMany()
                .HasForeignKey(e => e.StudentId)
                .HasPrincipalKey(s => s.IdStudent);
        });

        modelBuilder.Entity<Vle>(entity =>
        {
            entity.HasKey(e => e.IdSite).HasName("PK__vle__4594B5E6AC690155");

            entity.ToTable("vle");

            entity.Property(e => e.IdSite)
                .ValueGeneratedNever()
                .HasColumnName("id_site");
            entity.Property(e => e.ActivityType)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("activity_type");
            entity.Property(e => e.CodeModule)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_module");
            entity.Property(e => e.CodePresentation)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("code_presentation");
            entity.Property(e => e.WeekFrom)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("week_from");
            entity.Property(e => e.WeekTo)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("week_to");

            entity.HasOne(d => d.Course).WithMany(p => p.Vles)
                .HasForeignKey(d => new { d.CodeModule, d.CodePresentation })
                .HasConstraintName("FK__vle__3C69FB99");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
