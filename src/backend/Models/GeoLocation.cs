using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
    public class GeoLocation
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Point";

        [BsonElement("coordinates")]
        public double[] Coordinates { get; set; } // [longitude, latitude]
    }
}
