using BoraLaBackend.Models;
using BoraLaBackend.Shared.Database;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Events.Repository
{
    public class EventRepository : IEventRepository
    {
        private readonly IMongoCollection<Event> _events;

        public EventRepository(IMongoClient client, IOptions<MongoSettings> settings)
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _events = db.GetCollection<Event>("events");
        }

        public async Task<Event> CreateAsync(Event evt)
        {
            await _events.InsertOneAsync(evt);
            return evt;
        }

        public async Task<Event?> GetByIdAsync(string id)
        {
            return await _events.Find(e => e.Id == id).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Event>> GetFeedAsync(DateTime from)
        {
            return await _events
                .Find(e => e.Date >= from)
                .SortBy(e => e.Date)
                .ToListAsync();
        public async Task UpdateAsync(string id, Event evt)
        {
            await _events.ReplaceOneAsync(e => e.Id == id, evt);
        }

        public async Task DeleteAsync(string id)
        {
            await _events.DeleteOneAsync(e => e.Id == id);
        }
    }
}
