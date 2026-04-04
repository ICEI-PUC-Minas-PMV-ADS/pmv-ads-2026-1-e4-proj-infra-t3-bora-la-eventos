using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Repository
{
    public interface IEventRepository
    {
        Task<Event> CreateAsync(Event evt);
        Task<Event?> GetByIdAsync(string id);
        Task<IEnumerable<Event>> GetFeedAsync(DateTime from);
    }
}
