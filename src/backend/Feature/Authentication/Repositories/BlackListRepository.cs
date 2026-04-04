using BoraLaBackend.Models;
using BoraLaBackend.Shared.Database;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Authentication.Repositories
{
  public class BlackListRepository: IBlackListRepository
  {
    private readonly IMongoCollection<BlacklistedToken> _blackList;

    public BlackListRepository(IMongoClient client, IOptions<MongoSettings> settings)
    {
      var db = client.GetDatabase(settings.Value.DatabaseName);
      _blackList = db.GetCollection<BlacklistedToken>("blacklisted_tokens");
    }

    public async Task Insert(BlacklistedToken doc) => await _blackList.InsertOneAsync(doc);
  }
}