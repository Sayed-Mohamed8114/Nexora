using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Courses;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.implementations
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public CourseService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
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
                .Include(c => c.StudentInfos)
                .FirstOrDefaultAsync(c => c.CodeModule == codeModule && c.CodePresentation == codePresentation);

            if (existingCourse == null) return null;

            // Capture enrolled student IDs before making changes
            var enrolledStudentIds = existingCourse.StudentInfos
                .Select(si => si.IdStudent)
                .ToList();

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

            // --- Notify enrolled students that the course was updated ---
            if (enrolledStudentIds.Any())
            {
                // Resolve User.Id for each enrolled student (StudentInfo uses dataset StudentId or falls back to User.Id)
                var userIds = await _context.Users
                    .Where(u => (u.StudentId.HasValue && enrolledStudentIds.Contains(u.StudentId.Value))
                             || enrolledStudentIds.Contains(u.Id))
                    .Select(u => u.Id)
                    .ToListAsync();

                var tutorName = existingCourse.Tutor != null
                    ? $"{existingCourse.Tutor.FirstName} {existingCourse.Tutor.LastName}".Trim()
                    : "Your tutor";

                var updatedCourseName = string.IsNullOrWhiteSpace(existingCourse.Name)
                    ? $"{codeModule} ({codePresentation})"
                    : existingCourse.Name;

                foreach (var uid in userIds)
                {
                    await _notificationService.SendNotificationAsync(
                        userId: uid,
                        title: "📚 Course Updated!",
                        message: $"The course \"{updatedCourseName}\" has been updated by {tutorName}. Check it out for the latest changes.",
                        type: "CourseUpdated"
                    );
                }
            }

            return existingCourse;
        }

        public async Task<bool> DeleteCourseAsync(string codeModule, string codePresentation)
        {
            var course = await _context.Courses
                .Include(c => c.Tutor)
                .Include(c => c.StudentInfos)
                .FirstOrDefaultAsync(c => c.CodeModule == codeModule && c.CodePresentation == codePresentation);

            if (course == null) return false;

            // --- Notify enrolled students BEFORE deleting ---
            var enrolledStudentIds = course.StudentInfos.Select(si => si.IdStudent).ToList();
            if (enrolledStudentIds.Any())
            {
                var userIds = await _context.Users
                    .Where(u => (u.StudentId.HasValue && enrolledStudentIds.Contains(u.StudentId.Value))
                             || enrolledStudentIds.Contains(u.Id))
                    .Select(u => u.Id)
                    .ToListAsync();

                var tutorName = course.Tutor != null
                    ? $"{course.Tutor.FirstName} {course.Tutor.LastName}".Trim()
                    : "Your tutor";

                var deletedCourseName = string.IsNullOrWhiteSpace(course.Name)
                    ? $"{codeModule} ({codePresentation})"
                    : course.Name;

                foreach (var uid in userIds)
                {
                    await _notificationService.SendNotificationAsync(
                        userId: uid,
                        title: "⚠️ Course Removed",
                        message: $"The course \"{deletedCourseName}\" by {tutorName} has been removed. Please explore other available courses.",
                        type: "CourseDeleted"
                    );
                }
            }

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

        public async Task<bool> EnrollStudentAsync(int userId, int studentId, string codeModule, string codePresentation)
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

            // --- Notify the tutor (if the course has one) ---
            if (course.TutorId.HasValue)
            {
                // Resolve student's display name from their User account
                var student = await _context.Users.FindAsync(userId);
                var studentName = student != null
                    ? $"{student.FirstName} {student.LastName}".Trim()
                    : $"Student #{studentId}";

                var courseName = string.IsNullOrWhiteSpace(course.Name)
                    ? $"{codeModule} ({codePresentation})"
                    : course.Name;

                await _notificationService.SendNotificationAsync(
                    userId: course.TutorId.Value,
                    title: "🎓 New Student Enrolled!",
                    message: $"{studentName} has just enrolled in your course \"{courseName}\".",
                    type: "Enrollment"
                );
            }

            return true;
        }

        public async Task<bool> UnenrollStudentAsync(int userId, int studentId, string codeModule, string codePresentation)
        {
            var info = await _context.StudentInfos
                .FirstOrDefaultAsync(si => si.IdStudent == studentId
                                        && si.CodeModule == codeModule
                                        && si.CodePresentation == codePresentation);

            if (info == null) return false; // Not enrolled

            _context.StudentInfos.Remove(info);
            await _context.SaveChangesAsync();

            // --- Notify the tutor (if the course has one) ---
            var course = await GetCourseByCodeAsync(codeModule, codePresentation);
            if (course != null && course.TutorId.HasValue)
            {
                var student = await _context.Users.FindAsync(userId);
                var studentName = student != null
                    ? $"{student.FirstName} {student.LastName}".Trim()
                    : $"Student #{studentId}";

                var courseName = string.IsNullOrWhiteSpace(course.Name)
                    ? $"{codeModule} ({codePresentation})"
                    : course.Name;

                await _notificationService.SendNotificationAsync(
                    userId: course.TutorId.Value,
                    title: "🚪 Student Unenrolled",
                    message: $"{studentName} has unenrolled from your course \"{courseName}\".",
                    type: "Unenrollment"
                );
            }

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