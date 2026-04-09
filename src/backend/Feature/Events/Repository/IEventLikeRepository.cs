using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Repository
{
    public interface IEventLikeRepository
    {
        Task<EventLike?> GetAsync(string userId, string eventId);
        Task AddAsync(EventLike like);
        Task RemoveAsync(string id);
        Task<int> CountLikesAsync(string eventId);
    }
}
