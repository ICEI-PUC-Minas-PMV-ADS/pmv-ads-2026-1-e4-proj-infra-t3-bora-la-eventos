using MongoDB.Bson.Serialization.Attributes;

namespace BoraLaBackend.Models
{
  public class BlacklistedToken
  {
    [BsonId]
    public string Id { get; set; } // jti
    public DateTime ExpiresAt { get; set; }
  }
}