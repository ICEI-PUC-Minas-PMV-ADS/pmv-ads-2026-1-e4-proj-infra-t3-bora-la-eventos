using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRequired]
        public string Name { get; set; }

        [BsonRequired]
        public string Document { get; set; }

        [BsonRequired]
        public string Email { get; set; }

        [BsonRequired]
        public string Password { get; set; }

        [BsonRequired]
        public Role Role { get; set; }
        
        public int TokenVersion { get; set; } = 0;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime UpdatedAt { get; set; }
    }

    public enum Role
    {
        User,
        Organizer
    }
}
