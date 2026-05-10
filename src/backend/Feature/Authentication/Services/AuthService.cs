
using BoraLaBackend.Feature.Authentication.DTO;
using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services.Interfaces;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Models;
using BoraLaBackend.Shared.Security;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using BoraLaBackend.Feature.Users.DTO;


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

      var token = _jwtService.GenerateToken(internalClientId, null, null);

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
      if (usr == null) return AuthResults.Unauthorized;

      bool isValidPassword = _pass.Check(password, usr.Password);
      if (!isValidPassword) return AuthResults.Unauthorized;

      string token = _jwtService.GenerateToken(id, email, usr.Id, usr.TokenVersion);

      var userResponse = new UserResponse
      {
        Id = usr.Id, 
        Name = usr.Name,
        Email = usr.Email,
        Document = usr.Document,
        Role = usr.Role.ToString(),
        CreatedAt = usr.CreatedAt,
        UpdatedAt = usr.UpdatedAt
      };

     LoginReturn data = new(userResponse, token);
     return AuthResults.LoginSuccess(data);
    }

    public async Task<AuthResults> Logout(string token)
    {
    string purgedToken = token.Replace("Bearer ", "");
    var decoder = new JwtDecoder(new JsonNetSerializer(), new JwtValidator(new JsonNetSerializer(), new UtcDateTimeProvider()), new JwtBase64UrlEncoder(), new HMACSHA256Algorithm());
    try
    {
        var payload = decoder.DecodeToObject<Dictionary<string, object>>(purgedToken, _config["Auth:ServerSecret"], verify: true);

        if (payload != null && payload.TryGetValue("email", out var emailObj))
        {
            var email = emailObj.ToString();
            var user = await _usrRepository.GetByEmailAsync(email);

            if (user != null)
            {
                user.TokenVersion += 1;
                await _usrRepository.UpdateAsync(user.Id, user);
            }
        }
        }
        catch
        {
            return AuthResults.Unprocessable;
        }

        return AuthResults.LogoutSuccess();
    }
  }
}