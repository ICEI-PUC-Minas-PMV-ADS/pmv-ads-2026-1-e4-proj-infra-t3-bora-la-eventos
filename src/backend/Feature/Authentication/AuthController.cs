using System.ComponentModel.DataAnnotations;
using BoraLaBackend.Feature.Authentication.DTO;
using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Infrastructure.Security;
using BoraLaBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Authentication
{
  [Route("auth")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IMongoDatabase _db;
    private readonly IConfiguration _config;
    private readonly IJwtService _jwtService;

    public AuthController(
      MongoClient client,
      IOptions<MongoSettings> settings,
      IConfiguration config,
      IJwtService jwtService
    )
    {
      _db = client.GetDatabase(settings.Value.DatabaseName);
      _config = config;
      _jwtService = jwtService;
    }

    // POST /auth/pre-login
    [HttpPost("pre-login")]
    [AllowAnonymous]
    public IActionResult AppAuthorization([FromBody] AuthTokenReqDto request)
    {

      if (string.IsNullOrEmpty(request.ClientSecret) || string.IsNullOrEmpty(request.ClientID))
      {
        return BadRequest(new { code = "invalid_body" });
      }

      string? _clientSecret = _config["Auth:ClientSecret"];
      string? _clientId = _config["Auth:ClientID"];
      string? _serverSecret = _config["Auth:ServerSecret"];
      if (_clientSecret == null || _serverSecret == null || _clientId == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
      }

      string token = _jwtService.GenerateToken(_clientId, null);

      return Ok(new { token = $"Bearer {token}" });
    }

    // POST: /auth/validate
    [HttpPost("validate")]
    [AllowAnonymous]
    public IActionResult Validate([FromBody] ValidateTokenRequestDto request)
    {

      if (string.IsNullOrEmpty(request.token))
        return BadRequest(new { error = "Token is required" });
      string validToken = request.token.Split(' ')[1];

      bool isValid = _jwtService.ValidateToken(validToken);

      return Ok(new { isValid });
    }

    // POST: /auth/sign-in
    [HttpPost("login")]
    [Authorize]
    public async Task<IActionResult> Login([FromBody] SignInRequestDto props)
    {
      if (string.IsNullOrEmpty(props.Email) || string.IsNullOrEmpty(props.Password))
      {
        return BadRequest("invalid_body");
      }

      var user = await _db
        .GetCollection<User>("users")
        .Find((item) => item.Email == props.Email)
        .ToListAsync();

      if (user == null)
      {
        return NotFound(new { code = "user_not_found" });
      }
      // Precisa implementar a decriptação da senha
      // Validar a senha infromada com a senha decriptada
      // retornar o Ok(user) caso positivo ou Unauthorize() caoso negativo
      return Ok();
    }

    // POST: /auth/logout
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
      var authHeader = Request.Headers.Authorization.ToString();

      if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
          return NotFound("parameter_not_founded");

      var token = authHeader.Replace("Bearer ", "");

      bool wasInvalidated = await _jwtService
        .InvalidateToken(token, _db.GetCollection<BlacklistedToken>("blacklisted_tokens"));
      return wasInvalidated ? Ok() : BadRequest();
    }
  }
}
