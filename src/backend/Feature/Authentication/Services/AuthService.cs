
using BoraLaBackend.Feature.Authentication.DTO;
using BoraLaBackend.Shared.Security;
using BoraLaBackend.Feature.Authentication.Services.Interfaces;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Authentication.Services
{
  public class AuthService(
    IConfiguration config,
    IJwtService jwtService,
    IPasswordService password,
    IUserRepository userRepository,
    IBlackListRepository blRepository
  ) : IAuthService
  {
    private readonly IConfiguration _config = config;
    private readonly IJwtService _jwtService = jwtService;
    private readonly IUserRepository _usrRepository = userRepository;
    private readonly IBlackListRepository _blRepository = blRepository;
    private readonly IPasswordService _pass = password;

    public TokenResults GenerateToken(string id, string secret)
    {
      var internalClientId = _config["Auth:ClientID"];
      var internalSecret = _config["Auth:ClientSecret"];

      if (string.IsNullOrEmpty(internalClientId) || string.IsNullOrEmpty(internalSecret))
        return TokenResults.Error;

      if (id != internalClientId || secret != internalSecret)
        return TokenResults.Unauthorized;

      var token = _jwtService.GenerateToken(internalClientId, null);

      return TokenResults.Success(token);
    }

    public async Task<AuthResults> Login(string email, string password, string id)
    {
      string? clientId = _config["Auth:ClientID"];
      bool hasEmptyBody = string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password);

      if (string.IsNullOrEmpty(clientId)) return AuthResults.ServerError;
      if (string.IsNullOrEmpty(id)) return AuthResults.BadRequest;
      if (hasEmptyBody) return AuthResults.InvalidBody;
      if (id != clientId) return AuthResults.Unprocessable;

      var usr = await _usrRepository.GetByEmailAsync(email);
      if (usr == null) return AuthResults.NotFounded;

      bool isValidPassword = _pass.Check(password, usr.Password);
      if (!isValidPassword) return AuthResults.Unauthorized;

      string token = _jwtService.GenerateToken(id, email);
      LoginReturn data = new(usr, token);
      return AuthResults.LoginSuccess(data);
    }
    public async Task<AuthResults> Logout(string token)
    {
      string purgedToken = token.Replace("Bearer ", "");
      ValidateTokenReturnProps? data = _jwtService.InvalidateToken(purgedToken);

      if (data == null) return AuthResults.ServerError;

      BlacklistedToken field = new()
      {
        Id = data.Jti,
        ExpiresAt = data.Date
      };
      try
      {
        await _blRepository.Insert(field);
        return AuthResults.LogoutSuccess();
        
      } catch
      {
        return AuthResults.Unprocessable;
      }

    }
  }
}