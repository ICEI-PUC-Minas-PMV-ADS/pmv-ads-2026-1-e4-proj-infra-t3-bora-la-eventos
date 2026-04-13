using BoraLaBackend.Models;
using BoraLaBackend.Shared.Database;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;


namespace BoraLaBackend.Feature.Events.Repository
{
    public class EventLikeRepository : IEventLikeRepository
    {
        private readonly IMongoCollection<EventLike> _likes;

        public EventLikeRepository (IMongoClient client, IOptions<MongoSettings> settings)
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _likes = db.GetCollection<EventLike>("event_likes");

            CreateIndexs();
        }

        private void CreateIndexs()
        {
            var indexKeys = Builders<EventLike>.IndexKeys
                .Ascending(x => x.UserId)
                .Ascending(x => x.EventId);

            var indexOptions = new CreateIndexOptions
            {
                Unique = true,
            };

            var model = new CreateIndexModel<EventLike>(indexKeys, indexOptions);

            _likes.Indexes.CreateOne(model);
        }

        public async Task<EventLike?> GetAsync(string userId, string eventId)
        {
            return await _likes
                .Find(x => x.UserId == userId && x.EventId == eventId)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(EventLike like)
        {
            try
            {
                await _likes.InsertOneAsync(like);
            }
            catch (MongoWriteException ex)
                when (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
            {
                //ignora like existente
            }
        }

        public async Task RemoveAsync(string id)
        {
            await _likes.DeleteOneAsync(x => x.Id == id);
        }

        public async Task<int> CountLikesAsync(string eventId)
        {
            return (int)await _likes
                .CountDocumentsAsync(x => x.EventId == eventId);
        }
    }

}
