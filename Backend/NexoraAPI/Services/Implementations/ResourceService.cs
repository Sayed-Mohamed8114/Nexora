using Microsoft.EntityFrameworkCore;
using NexoraAPI.Models;
using NexoraAPI.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NexoraAPI.Services.Implementations
{
    public class ResourceService : IResourceService
    {
        private readonly AppDbContext _context;

        public ResourceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Recommendation>> GetResourcesBySubject(string subject)
        {
            if (string.IsNullOrEmpty(subject))
                return new List<Recommendation>();

            return await _context.Recommendations
                .Where(r => r.SubjectName.ToLower() == subject.ToLower())
                .ToListAsync();
        }

        public async Task<List<Recommendation>> GetAllRecommendations()
        {
            return await _context.Recommendations.ToListAsync();
        }
    }
}