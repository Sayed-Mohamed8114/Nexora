using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Courses;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.implementations
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            var courses = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.CourseSkillTags)
                .Include(c => c.StudentInfos)
                .ToListAsync();

            foreach (var course in courses)
            {
                if (course.Tutor != null)
                    course.TutorName = $"{course.Tutor.FirstName} {course.Tutor.LastName}".Trim();

                course.Skills = course.CourseSkillTags.Select(t => t.SkillName).ToList();
                course.EnrolledCount = course.StudentInfos.Count;
            }
            return courses;
        }

        public async Task<Course?> GetCourseByCodeAsync(string codeModule, string codePresentation)
        {
            var course = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.CourseSkillTags)
                .Include(c => c.StudentInfos)
                .FirstOrDefaultAsync(c => c.CodeModule == codeModule && c.CodePresentation == codePresentation);

            if (course != null)
            {
                if (course.Tutor != null)
                    course.TutorName = $"{course.Tutor.FirstName} {course.Tutor.LastName}".Trim();

                course.Skills = course.CourseSkillTags.Select(t => t.SkillName).ToList();
                course.EnrolledCount = course.StudentInfos.Count;
            }

            return course;
        }

        public async Task<Course> AddCourseAsync(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateCourseAsync(string codeModule, string codePresentation, Course course, List<string>? skills = null)
        {
            var existingCourse = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.CourseSkillTags)
                .FirstOrDefaultAsync(c => c.CodeModule == codeModule && c.CodePresentation == codePresentation);

            if (existingCourse == null) return null;

            // Update editable fields
            existingCourse.Name = course.Name;
            existingCourse.Description = course.Description;
            existingCourse.Hours = course.Hours;

            // Sync skill tags if provided
            if (skills != null)
            {
                // Remove old tags
                _context.CourseSkillTags.RemoveRange(existingCourse.CourseSkillTags);

                // Add new tags
                foreach (var skill in skills.Where(s => !string.IsNullOrWhiteSpace(s)))
                {
                    _context.CourseSkillTags.Add(new CourseSkillTag
                    {
                        CodeModule = codeModule,
                        CodePresentation = codePresentation,
                        SkillName = skill.Trim()
                    });
                }
            }

            await _context.SaveChangesAsync();

            // Populate computed fields for response
            if (existingCourse.Tutor != null)
                existingCourse.TutorName = $"{existingCourse.Tutor.FirstName} {existingCourse.Tutor.LastName}".Trim();

            existingCourse.Skills = existingCourse.CourseSkillTags.Select(t => t.SkillName).ToList();

            return existingCourse;
        }

        public async Task<bool> DeleteCourseAsync(string codeModule, string codePresentation)
        {
            var course = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Course>> GetCoursesByTutorIdAsync(int tutorId)
        {
            var courses = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.CourseSkillTags)
                .Include(c => c.StudentInfos)
                .Where(c => c.TutorId == tutorId)
                .ToListAsync();

            foreach (var course in courses)
            {
                if (course.Tutor != null)
                    course.TutorName = $"{course.Tutor.FirstName} {course.Tutor.LastName}".Trim();

                course.Skills = course.CourseSkillTags.Select(t => t.SkillName).ToList();
                course.EnrolledCount = course.StudentInfos.Count;
            }
            return courses;
        }

        public async Task<bool> EnrollStudentAsync(int studentId, string codeModule, string codePresentation)
        {
            var course = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return false;

            // Check if already enrolled in this course (idempotent)
            var alreadyEnrolled = await _context.StudentInfos
                .AnyAsync(si => si.IdStudent == studentId
                             && si.CodeModule == codeModule
                             && si.CodePresentation == codePresentation);

            if (alreadyEnrolled) return true;

            var studentInfo = new StudentInfo
            {
                IdStudent = studentId,
                CodeModule = codeModule,
                CodePresentation = codePresentation
            };

            _context.StudentInfos.Add(studentInfo);
            await _context.SaveChangesAsync();

            // Reflect the new enrollment in the in-memory count
            course.EnrolledCount = await _context.StudentInfos
                .CountAsync(si => si.CodeModule == codeModule && si.CodePresentation == codePresentation);

            return true;
        }

        public async Task<bool> UnenrollStudentAsync(int studentId, string codeModule, string codePresentation)
        {
            var info = await _context.StudentInfos
                .FirstOrDefaultAsync(si => si.IdStudent == studentId
                                        && si.CodeModule == codeModule
                                        && si.CodePresentation == codePresentation);

            if (info == null) return false; // Not enrolled

            _context.StudentInfos.Remove(info);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EnrolledCourseDto>> GetEnrolledCoursesAsync(int studentId)
        {
            var enrollments = await _context.StudentInfos
                .Where(si => si.IdStudent == studentId)
                .Include(si => si.Course)
                    .ThenInclude(c => c.Tutor)
                .Include(si => si.Course)
                    .ThenInclude(c => c.CourseSkillTags)
                .ToListAsync();

            return enrollments.Select(si => new EnrolledCourseDto
            {
                CodeModule        = si.Course.CodeModule,
                CodePresentation  = si.Course.CodePresentation,
                Name              = si.Course.Name,
                Description       = si.Course.Description,
                Hours             = si.Course.Hours,
                TutorId           = si.Course.TutorId,
                TutorName         = si.Course.Tutor != null
                                        ? $"{si.Course.Tutor.FirstName} {si.Course.Tutor.LastName}".Trim()
                                        : string.Empty,
                Skills            = si.Course.CourseSkillTags.Select(t => t.SkillName).ToList(),
                FinalResult       = si.FinalResult,
                NumOfPrevAttempts = si.NumOfPrevAttempts,
                StudiedCredits    = si.StudiedCredits
            });
        }

        public async Task<int?> GetStudentIdForUserAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.StudentId)
                .FirstOrDefaultAsync();
        }
    }
}