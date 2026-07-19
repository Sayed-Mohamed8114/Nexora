using System.Collections.Generic;
using System.Threading.Tasks;
using NexoraAPI.Models;

namespace NexoraAPI.Services.Interfaces
{
    public interface IResourceService
    {
        Task<List<Recommendation>> GetResourcesBySubject(string subject);
        Task<List<Recommendation>> GetAllRecommendations();
    }
}
