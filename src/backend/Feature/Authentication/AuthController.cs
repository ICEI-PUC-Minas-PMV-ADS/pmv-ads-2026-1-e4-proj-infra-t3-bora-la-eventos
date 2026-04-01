using BoraLaBackend.Feature.Authentication.DTO;
using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Infrastructure.Security;
using BoraLaBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Authentication
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
      var db = client.GetDatabase(settings.Value.DatabaseName);
      _users = db.GetCollection<User>("users");
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
                return BadRequest(new { message = "MISSING_PROPERTIES" });
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
  }
}
