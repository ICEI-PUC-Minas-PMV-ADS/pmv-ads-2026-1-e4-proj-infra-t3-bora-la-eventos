using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
    public class Comment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string EventId { get; set; }

        [BsonRequired]
        public string Text { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }
    }
}