using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Infrastructure.Security;
using BoraLaBackend.Models;
using Microsoft.AspNetCore.Http;
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
          MongoClient client,
          IOptions<MongoSettings> settings
        )
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>("users");
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            List<User> Users = _users.Find(user => true).ToList();

            return Ok(Users);
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
