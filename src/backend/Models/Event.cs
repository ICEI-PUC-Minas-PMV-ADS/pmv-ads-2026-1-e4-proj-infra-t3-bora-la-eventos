using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }
        
        public Address Address { get; set; }
        
        public string Location { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime Date { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string OrganizerId { get; set; }

        public int Capacity { get; set; }
        public List<string> Comments { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public List<ObjectId> Participants { get; set; } = new List<ObjectId>();

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime UpdatedAt { get; set; }
    }
}