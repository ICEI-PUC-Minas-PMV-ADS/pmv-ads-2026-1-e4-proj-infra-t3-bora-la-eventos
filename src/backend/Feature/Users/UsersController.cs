using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Models;
using BoraLaBackend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Users
{
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public UsersController(
          IMongoClient client,
          IOptions<MongoSettings> settings
        )
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>("users");
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegisterRequest registerRequest)
        {
            if (string.IsNullOrEmpty(registerRequest.Email) || string.IsNullOrEmpty(registerRequest.Password))
            {
                return BadRequest(new { message = "MISSING_PROPERTIES" });
            }

            if (!DocumentValidator.GetRoleFromDocument(registerRequest.Document, out var role))
            {
                return BadRequest(new { message = "INVALID_DOCUMENT" });
            }

            var existingUser = _users.Find(u => u.Email == registerRequest.Email).FirstOrDefault();
            if (existingUser != null)
            {
                return Conflict(new { message = "EMAIL_ALREADY_EXISTS" });
            }

            var user = new User
            {
                Name = registerRequest.Name,
                Document = registerRequest.Document,
                Email = registerRequest.Email,
                Role = role,
                TokenVersion = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            user.Password = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password);

            _users.InsertOne(user);
            return Ok(new { message = "USER_REGISTERED_SUCCESSFULLY" });
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            List<User> users = _users.Find(user => true).ToList();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(string id)
        {
            var user = _users.Find(u => u.Id == id).FirstOrDefault();
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            var user = _users.Find(u => u.Id == id).FirstOrDefault();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.Name = request.Name ?? user.Name;
            user.Document = request.Document ?? user.Document;
            user.Email = request.Email ?? user.Email;
            user.UpdatedAt = System.DateTime.UtcNow;

            _users.ReplaceOne(u => u.Id == id, user);

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(string id)
        {
            var user = _users.Find(u => u.Id == id).FirstOrDefault();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _users.DeleteOne(u => u.Id == id);

            return Ok(new { message = "User deleted successfully" });
        }
    }
}
