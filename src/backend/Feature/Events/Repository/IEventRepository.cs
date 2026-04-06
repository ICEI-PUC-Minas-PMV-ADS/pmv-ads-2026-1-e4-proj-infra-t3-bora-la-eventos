using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Repository
{
    public interface IEventRepository
    {
        Task<Event> CreateAsync(Event evt);
        Task<Event?> GetByIdAsync(string id);
        Task<IEnumerable<Event>> GetFeedAsync(DateTime from);
        Task<IEnumerable<Event>> SearchAsync(string? name, string? category);
        Task UpdateAsync(string id, Event evt);
        Task DeleteAsync(string id);
    }
}
