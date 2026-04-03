using BoraLaBackend.Models;
using MongoDB.Driver;

namespace BoraLaBackend.Infrastructure.Security
{
  public interface IJwtService
  {
    public string GenerateToken(string appId, string? email);

    public bool ValidateToken(string token);

    public Task<bool> InvalidateToken(string token, IMongoCollection<BlacklistedToken> collection);
  }
}