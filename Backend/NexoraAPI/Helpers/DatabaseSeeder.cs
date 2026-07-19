using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NexoraAPI.Models;

namespace NexoraAPI.Helpers
{
    public static class DatabaseSeeder
    {
        public static async Task SeedRecommendationsAsync(AppDbContext context)
        {
            // Seed recommendations if the table is empty
            if (!await context.Recommendations.AnyAsync())
            {
                var recommendations = new List<Recommendation>
                {
                    // For Course Codes (OULAD)
                    new Recommendation
                    {
                        Title = "Introduction to Social Sciences & Humanities",
                        Description = "A curated introductory guide to research methodologies and writing in the arts and social sciences.",
                        ResourceUrl = "https://www.coursera.org/learn/social-science-methods",
                        Type = "Course",
                        SubjectName = "AAA"
                    },
                    new Recommendation
                    {
                        Title = "Foundations of Science and Technology",
                        Description = "Essential scientific concepts, critical thinking skills, and academic writing practice.",
                        ResourceUrl = "https://www.edx.org/course/introduction-to-science-communication",
                        Type = "Course",
                        SubjectName = "BBB"
                    },
                    new Recommendation
                    {
                        Title = "Advanced Mathematics and Statistics",
                        Description = "A comprehensive video playlist covering linear algebra, calculus, and probability distributions.",
                        ResourceUrl = "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
                        Type = "Video",
                        SubjectName = "CCC"
                    },
                    new Recommendation
                    {
                        Title = "Systematic Engineering Design & Logic",
                        Description = "Mastering logical reasoning, engineering design processes, and problem solving.",
                        ResourceUrl = "https://www.coursera.org/learn/engineering-design",
                        Type = "Course",
                        SubjectName = "DDD"
                    },
                    new Recommendation
                    {
                        Title = "Environmental Science & Climate Studies",
                        Description = "Deep dive into ecology, global warming, sustainability, and renewable energy technologies.",
                        ResourceUrl = "https://www.edx.org/course/introduction-to-environmental-science",
                        Type = "Course",
                        SubjectName = "EEE"
                    },
                    new Recommendation
                    {
                        Title = "Principles of Computer Science & OOP",
                        Description = "An interactive code tutorial teaching object-oriented programming concepts and system design.",
                        ResourceUrl = "https://www.w3schools.com/cs/index.php",
                        Type = "Article",
                        SubjectName = "FFF"
                    },
                    new Recommendation
                    {
                        Title = "Business Management and Economics",
                        Description = "Basic principles of microeconomics, corporate finance, and strategic management.",
                        ResourceUrl = "https://www.coursera.org/specializations/wharton-business-foundations",
                        Type = "Course",
                        SubjectName = "GGG"
                    },

                    // For Skills
                    new Recommendation
                    {
                        Title = "Python for Everybody Specialization",
                        Description = "Learn to program and analyze data with Python. Beginners welcome.",
                        ResourceUrl = "https://www.coursera.org/specializations/python",
                        Type = "Course",
                        SubjectName = "Python"
                    },
                    new Recommendation
                    {
                        Title = "Modern CSS Design & Layouts",
                        Description = "Master Flexbox, Grid, and CSS variables with interactive exercises.",
                        ResourceUrl = "https://css-tricks.com/",
                        Type = "Article",
                        SubjectName = "CSS"
                    },
                    new Recommendation
                    {
                        Title = "HTML5 Semantic Web Structures",
                        Description = "A guide to building accessible, SEO-friendly HTML structures.",
                        ResourceUrl = "https://developer.mozilla.org/en-US/docs/Web/HTML",
                        Type = "Article",
                        SubjectName = "HTML"
                    },
                    new Recommendation
                    {
                        Title = "ASP.NET Core Web API Development",
                        Description = "Build high-performance RESTful APIs using ASP.NET Core and Entity Framework.",
                        ResourceUrl = "https://learn.microsoft.com/en-us/aspnet/core/",
                        Type = "Article",
                        SubjectName = ".Net"
                    },
                    new Recommendation
                    {
                        Title = "Node.js Complete Guide (MVC, REST APIs, GraphQL)",
                        Description = "Master Node.js, Express, MongoDB, and modern backend development.",
                        ResourceUrl = "https://www.youtube.com/watch?v=TlB_eWDSMt4",
                        Type = "Video",
                        SubjectName = "Node"
                    },
                    new Recommendation
                    {
                        Title = "MongoDB University: Basics to Advanced",
                        Description = "Learn how to model, query, and scale MongoDB databases.",
                        ResourceUrl = "https://university.mongodb.com/",
                        Type = "Course",
                        SubjectName = "MongoDB"
                    },
                    new Recommendation
                    {
                        Title = "Django Web Framework: Complete Walkthrough",
                        Description = "Build rapid database-driven web applications in Python using Django.",
                        ResourceUrl = "https://docs.djangoproject.com/en/stable/",
                        Type = "Article",
                        SubjectName = "Django"
                    },
                    new Recommendation
                    {
                        Title = "Building High-Performance APIs with FastAPI",
                        Description = "Learn FastAPI, dependency injection, and automatic OpenAPI generation.",
                        ResourceUrl = "https://fastapi.tiangolo.com/",
                        Type = "Article",
                        SubjectName = "Fast api"
                    },
                    new Recommendation
                    {
                        Title = "Tailwind CSS Crash Course",
                        Description = "Rapidly build modern websites without ever leaving your HTML.",
                        ResourceUrl = "https://tailwindcss.com/",
                        Type = "Article",
                        SubjectName = "Tailwind"
                    },
                    new Recommendation
                    {
                        Title = "Bootstrap 5 Responsive Grid & Components",
                        Description = "Quickly design and customize responsive mobile-first sites.",
                        ResourceUrl = "https://getbootstrap.com/",
                        Type = "Article",
                        SubjectName = "Bootstrap"
                    }
                };

                await context.Recommendations.AddRangeAsync(recommendations);
                await context.SaveChangesAsync();
            }
        }
    }
}
