using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Feature.Authentication.DTO;
using BoraLaBackend.Infrastructure.Security;
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
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config;
        private readonly IJwtService _jwtService;

        public AuthController(
          MongoClient client,
          IOptions<MongoSettings> settings,
          IConfiguration config,
          IJwtService jwtService
        )
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>("users");
            _config = config;
            _jwtService = jwtService;
        }


        [HttpPost("token")]
        public IActionResult Authentication([FromBody] AuthTokenReqDto request)
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
}
