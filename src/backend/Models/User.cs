using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }
        
        public long Document { get; set; } 
        
        public string Email { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }

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
