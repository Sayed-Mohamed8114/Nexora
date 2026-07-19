using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Courses;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NexoraAPI.Services.Implementations
{
    public class RecommendationEngineService : IRecommendationEngineService
    {
        private readonly AppDbContext _context;

        public RecommendationEngineService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourseResponseDto>> GenerateRecommendationsAsync(int userId, int studentId)
        {
            // 1. Get student's selected skills
            var studentSkills = await _context.StudentSkills
                .Where(s => s.UserId == userId)
                .Select(s => s.SkillName.ToLower().Trim())
                .ToListAsync();

            // 2. Get student's enrolled courses to exclude them
            var enrolledModules = await _context.StudentInfos
                .Where(s => s.IdStudent == studentId)
                .Select(s => $"{s.CodeModule.ToLower().Trim()}|{s.CodePresentation.ToLower().Trim()}")
                .ToListAsync();

            var enrolledModulesSet = enrolledModules.ToHashSet();

            // 3. Fetch all courses with their tutors, skill tags, and enrolled student counts
            var allCourses = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.CourseSkillTags)
                .Include(c => c.StudentInfos)
                .ToListAsync();

            var recommendedCourses = new List<Course>();

            // 4. Find courses that match student's skills and are NOT enrolled
            foreach (var course in allCourses)
            {
                var courseKey = $"{course.CodeModule.ToLower().Trim()}|{course.CodePresentation.ToLower().Trim()}";
                
                // Exclude enrolled courses
                if (enrolledModulesSet.Contains(courseKey))
                    continue;

                // Check if course teaches any of the student's skills
                var courseSkills = course.CourseSkillTags
                    .Select(t => t.SkillName.ToLower().Trim())
                    .ToList();

                bool matchesSkill = courseSkills.Any(cs => studentSkills.Contains(cs));

                if (matchesSkill)
                {
                    recommendedCourses.Add(course);
                }
            }

            // 5. Fallback/Demo Mode: if no matches, recommend any courses they are not enrolled in yet
            if (!recommendedCourses.Any())
            {
                recommendedCourses = allCourses
                    .Where(c => !enrolledModulesSet.Contains($"{c.CodeModule.ToLower().Trim()}|{c.CodePresentation.ToLower().Trim()}"))
                    .Take(5)
                    .ToList();
            }

            // 6. Map to DTOs
            return recommendedCourses.Select(c => new CourseResponseDto
            {
                CodeModule = c.CodeModule,
                CodePresentation = c.CodePresentation,
                Name = c.Name,
                Description = c.Description,
                Hours = c.Hours,
                TutorId = c.TutorId,
                TutorName = c.Tutor != null ? $"{c.Tutor.FirstName} {c.Tutor.LastName}".Trim() : string.Empty,
                Skills = c.CourseSkillTags.Select(t => t.SkillName).ToList(),
                EnrolledCount = c.StudentInfos.Count
            }).ToList();
        }
    }
}