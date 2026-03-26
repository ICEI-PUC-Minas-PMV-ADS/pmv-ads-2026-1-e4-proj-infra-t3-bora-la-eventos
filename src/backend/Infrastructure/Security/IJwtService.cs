namespace BoraLaBackend.Infrastructure.Security
{
  public interface IJwtService
  {
    public string GenerateToken(string appId, string? email);

    public bool ValidateToken(string token);
  }
}