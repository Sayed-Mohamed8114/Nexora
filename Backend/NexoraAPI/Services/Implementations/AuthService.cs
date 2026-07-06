using Microsoft.EntityFrameworkCore;
using NexoraAPI.DTOs.Auth;
using NexoraAPI.Enums;
using NexoraAPI.Helpers;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;

namespace NexoraAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<bool> RegisterAsync(RegisterDto dto)
        {
            if (dto.Role == UserRole.Student)
            {
                if (dto.StudentId.HasValue)
                {
                    var studentExists = await _context.StudentInfos
                        .AnyAsync(s => s.IdStudent == dto.StudentId.Value);

                    if (!studentExists)
                        return false;

                    var userExists = await _context.Users
                        .AnyAsync(u => u.StudentId == dto.StudentId.Value);

                    if (userExists)
                        return false;
                }
            }
            else
            {
                // Tutors do not have a StudentId
                dto.StudentId = null;
            }

            // Email Format Check
            if (string.IsNullOrWhiteSpace(dto.Email) || !System.Text.RegularExpressions.Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return false;

            // Password Strength Check (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special)
            if (string.IsNullOrWhiteSpace(dto.Password) || !System.Text.RegularExpressions.Regex.IsMatch(dto.Password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$"))
                return false;

            // Email Uniqueness Check
            var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                return false;

            var user = new User
            {
                StudentId = dto.StudentId,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                EmailVerified = true, // Set to true because the Regex format is valid
                Role = dto.Role,
                CreatedAt = DateTime.Now
            };


            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return null;

            var validPassword =
                PasswordHasher.Verify(dto.Password, user.PasswordHash);

            if (!validPassword)
                return null;

            user.LastLogin = DateTime.Now;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token
            };
        }
    }
}