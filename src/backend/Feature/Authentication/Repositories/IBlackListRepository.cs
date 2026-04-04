using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Authentication.Repositories
{
  public interface IBlackListRepository
  {
    public Task Insert(BlacklistedToken doc);
  }
}