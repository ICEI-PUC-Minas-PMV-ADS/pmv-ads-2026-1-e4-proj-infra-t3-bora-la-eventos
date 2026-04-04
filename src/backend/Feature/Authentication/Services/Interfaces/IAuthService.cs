using BoraLaBackend.Feature.Authentication.DTO;

namespace BoraLaBackend.Feature.Authentication.Services.Interfaces
{
  public interface IAuthService
  {
    public TokenResults GenerateToken(string id, string secret);
    public Task<AuthResults> Login(string email, string password, string id);
    public Task<AuthResults> Logout(string token);
  }
}