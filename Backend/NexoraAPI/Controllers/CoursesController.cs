using Microsoft.AspNetCore.Mvc;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> GetCourse(string codeModule, string codePresentation)
        {
            var course = await _courseService.GetCourseByCodeAsync(codeModule, codePresentation);
            if (course == null) return NotFound("Course not found!");

            return Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] Course course)
        {
            if (course == null) return BadRequest();

            var createdCourse = await _courseService.AddCourseAsync(course);
            return CreatedAtAction(nameof(GetCourse),
                new { codeModule = createdCourse.CodeModule, codePresentation = createdCourse.CodePresentation },
                createdCourse);
        }

        [HttpPut("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> UpdateCourse(string codeModule, string codePresentation, [FromBody] Course course)
        {
            var updatedCourse = await _courseService.UpdateCourseAsync(codeModule, codePresentation, course);
            if (updatedCourse == null) return NotFound("Course not found to update!");

            return Ok(updatedCourse);
        }

        [HttpDelete("{codeModule}/{codePresentation}")]
        public async Task<IActionResult> DeleteCourse(string codeModule, string codePresentation)
        {
            var result = await _courseService.DeleteCourseAsync(codeModule, codePresentation);
            if (!result) return NotFound("Course not found to delete!");

            return Ok("Course deleted successfully.");
        }
    }
}