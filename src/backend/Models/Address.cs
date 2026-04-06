using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
    public class Address
    {
        [BsonRequired]
        public string Street { get; set; }

        [BsonRequired]
        public string Number { get; set; }

        [BsonRequired]
        public string City { get; set; }

        [BsonRequired]
        public string State { get; set; }

        [BsonRequired]
        public string ZipCode { get; set; }
    }
}