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
    public class AuthController(
      MongoClient client,
      IOptions<MongoSettings> settings,
      IConfiguration config,
      IJwtService jwtService
        ) : ControllerBase
    {
        private readonly IMongoDatabase _db = client.GetDatabase(settings.Value.DatabaseName);
        private readonly IConfiguration _config = config;
        private readonly IJwtService _jwtService = jwtService;

        // POST /auth/pre-login
        [HttpPost("pre-login")]
        [AllowAnonymous]
        public IActionResult AppAuthorization([FromBody] AuthTokenReqDto request)
        {
            bool isNullOrEmpty = string.IsNullOrEmpty(request.ClientSecret) || string.IsNullOrEmpty(request.ClientID);

            if (isNullOrEmpty)
            {
                return BadRequest(new { code = "INVALID_BODY" });
            }
            string? serverSecret = _config["Auth:ServerSecret"];
            string? clientId = _config["Auth:ClientID"];
            string? clientSecret = _config["Auth:ClientSecret"];
            if (clientSecret == null || serverSecret == null || clientId == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "INTERNAL_SERVER_ERROR");
            }

            bool doesNotMatches = request.ClientID != clientId || request.ClientSecret != clientSecret;
            if (doesNotMatches) return Unauthorized();

            string token = _jwtService.GenerateToken(clientId, null);

            return Ok(new { token = $"Bearer {token}" });
        }

        // POST: /auth/login
        [HttpPost("login")]
        [Authorize]
        public async Task<IActionResult> Login(
            [FromBody] SignInRequestDto props,
            [FromHeader(Name = "x-request-id")] string appId
        )
        {
            string? clientId = _config["Auth:ClientID"];
            bool hasEmptyBody = string.IsNullOrEmpty(props.Email) || string.IsNullOrEmpty(props.Password);

            if (string.IsNullOrEmpty(clientId)) return StatusCode(StatusCodes.Status500InternalServerError, "INTERNAL_SERVER_ERROR");

            if (string.IsNullOrEmpty(appId)) return BadRequest(new { message = "INVALID_HEADER" });

            if (hasEmptyBody) return BadRequest(new { message = "INVALID_BODY" });

            if (appId != clientId) return UnprocessableEntity();

            User? user = await _db
              .GetCollection<User>("users")
              .Find((item) => item.Email == props.Email)
              .FirstAsync();

            if (user == null) return NotFound();

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(props.Password, user.Password);
            string token = _jwtService.GenerateToken(appId, props.Email);

            return isValidPassword ? Ok(new { currentUser = user, accessToken = token }) : Unauthorized();
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
