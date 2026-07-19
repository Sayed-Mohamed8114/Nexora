using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NexoraAPI.Services.Implementations
{
    public class StudentProfileService : IStudentProfileService
    {
        private readonly AppDbContext _context;

        public StudentProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetStudentBasicInfo(int studentId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == studentId);
        }

        public async Task<double> GetAverageScore(int studentId)
        {
            var user = await GetStudentBasicInfo(studentId);

            if (user == null)
                return 0;

            var resolvedStudentId = user.StudentId ?? user.Id;

            return await _context.StudentAssessments
                .Where(sa => sa.IdStudent == resolvedStudentId && sa.Score.HasValue)
                .AverageAsync(sa => (double?)sa.Score) ?? 0;
        }

        public async Task<List<string>> GetStudentSkills(int studentId)
        {
            return await _context.StudentSkills
                .Where(s => s.UserId == studentId)
                .Select(s => s.SkillName)
                .ToListAsync();
        }

        public async Task<List<string>> GetWeakSubjects(int studentId)
        {
            var user = await GetStudentBasicInfo(studentId);

            if (user == null)
                return new List<string>();

            var resolvedStudentId = user.StudentId ?? user.Id;

            return await _context.StudentAssessments
                .Where(sa => sa.IdStudent == resolvedStudentId && sa.Score < 60)
                .Join(
                    _context.Assessments,
                    sa => sa.IdAssessment,
                    a => a.IdAssessment,
                    (sa, a) => a.CodeModule
                )
                .Where(codeModule => codeModule != null)
                .Select(codeModule => codeModule!)
                .Distinct()
                .ToListAsync();
        }

        public async Task<int> GetTotalClicks(int studentId)
        {
            var user = await GetStudentBasicInfo(studentId);

            if (user == null)
                return 0;

            var resolvedStudentId = user.StudentId ?? user.Id;

            return await _context.StudentVles
                .Where(sv => sv.IdStudent == resolvedStudentId && sv.SumClick.HasValue)
                .SumAsync(sv => sv.SumClick!.Value);
        }

        public string GetEngagementLevel(int totalClicks)
        {
            if (totalClicks >= 1500)
                return "Very High";
            if (totalClicks >= 800)
                return "High";
            if (totalClicks >= 300)
                return "Medium";
            if (totalClicks >= 50)
                return "Low";
            return "Inactive";
        }

        public string GetPerformanceLevel(double averageScore, bool hasAssessments)
        {
            if (!hasAssessments)
                return "New Student";

            if (averageScore >= 85)
                return "Excellent";

            if (averageScore >= 70)
                return "Good";

            if (averageScore >= 50)
                return "Average";

            return "Needs Support";
        }

        public async Task<StudentProfileDto?> GetStudentProfileAsync(int studentId)
        {
            var user = await GetStudentBasicInfo(studentId);

            if (user == null)
                return null;

            var averageScore = await GetAverageScore(studentId);
            var resolvedStudentId = user.StudentId ?? user.Id;
            var hasAssessments = await _context.StudentAssessments
                .AnyAsync(sa => sa.IdStudent == resolvedStudentId);
            
            var totalClicks = await GetTotalClicks(studentId);

            return new StudentProfileDto
            {
                StudentId = studentId,
                StudentName = $"{user.FirstName} {user.LastName}",
                AverageScore = averageScore,
                PerformanceLevel = GetPerformanceLevel(averageScore, hasAssessments),
                TotalClicks = totalClicks,
                EngagementLevel = GetEngagementLevel(totalClicks),
                Skills = await GetStudentSkills(studentId),
                WeakSubjects = await GetWeakSubjects(studentId)
            };
        }


    }
}