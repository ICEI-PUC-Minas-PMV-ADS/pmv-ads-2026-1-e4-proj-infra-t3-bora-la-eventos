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

        [BsonRequired]
        public string Title { get; set; }

        [BsonRequired]
        public string Description { get; set; }

        [BsonRequired]
        public Address Address { get; set; }

        [BsonRequired]
        public string Location { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime Date { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OrganizerId { get; set; }

        [BsonRequired]
        public int Capacity { get; set; }

        public List<string> Comments { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Participants { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime UpdatedAt { get; set; }
    }
}