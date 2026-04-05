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
        }

        public async Task<IEnumerable<Event>> SearchAsync(string? name, string? category)
        {
            var filters = new List<FilterDefinition<Event>>();

            if (!string.IsNullOrWhiteSpace(name))
            {
                filters.Add(Builders<Event>.Filter.Regex("Title", new MongoDB.Bson.BsonRegularExpression(name, "i")));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                filters.Add(Builders<Event>.Filter.Eq("Category", category));
            }

            if (filters.Count == 0)
            {
                return new List<Event>();
            }

            var filter = filters.Count == 1
                ? filters[0]
                : Builders<Event>.Filter.And(filters);

            return await _events
                .Find(filter)
                .SortByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

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
