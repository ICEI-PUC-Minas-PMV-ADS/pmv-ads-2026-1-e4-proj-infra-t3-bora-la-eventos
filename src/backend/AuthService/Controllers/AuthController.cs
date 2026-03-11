using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using UserModel;
using MongoDBSettings;

namespace AuthControllerAPI
{
  [Route("auth")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IMongoCollection<User> _users;

    public AuthController(MongoClient client, IOptions<MongoSettings> settings)
    {
      var db = client.GetDatabase(settings.Value.DatabaseName);
      _users = db.GetCollection<User>("users");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
            try
            {
                await _users.InsertOneAsync(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
    }
  }
}