using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Feature.Users.Enums;
using BoraLaBackend.Feature.Users.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.Users
{
    [Authorize]
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _userService;

        public UsersController(IUsersService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _userService.RegisterAsync(request);

            return result switch
            {
                RegisterResult.Success => Ok(new { message = "USER_REGISTERED_SUCCESSFULLY" }),
                RegisterResult.EmailExists => Conflict(new { message = "EMAIL_ALREADY_IN_USE" }),
                RegisterResult.DocumentExists => Conflict(new { message = "DOCUMENT_ALREADY_IN_USE" }),
                RegisterResult.InvalidDocument => BadRequest(new { message = "INVALID_DOCUMENT" }),
                RegisterResult.InvalidInput => BadRequest(new { message = "MISSING_PROPERTIES" }),
                _ => StatusCode(500)
            };
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "USER_NOT_FOUNDED" });
            }
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            var user = await _userService.UpdateUserAsync(id, request);
            if (user == null)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(new { message = "USER_DELETE_SUCCESSFULY" });
        }
    }
}