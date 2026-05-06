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

        /// <summary>Registra um novo usuário no sistema.</summary>
        /// <remarks>Permite o cadastro de novos usuários como participantes (CPF) ou organizadores (CNPJ).</remarks>
        /// <response code="200">Usuário registrado com sucesso.</response>
        /// <response code="400">Documento inválido.</response>
        /// <response code="409">Email ou documento já estão em uso.</response>
        /// <response code="500">Erro interno do servidor.</response>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _userService.RegisterAsync(request);

            return result switch
            {
                RegisterResult.Success => Ok(new { message = "USER_REGISTERED_SUCCESSFULLY" }),
                RegisterResult.EmailExists => Conflict(new { message = "EMAIL_ALREADY_IN_USE" }),
                RegisterResult.DocumentExists => Conflict(new { message = "DOCUMENT_ALREADY_IN_USE" }),
                RegisterResult.InvalidDocument => BadRequest(new { message = "INVALID_DOCUMENT" }),
                _ => StatusCode(500)
            };
        }

        /// <summary>Lista todos os usuários.</summary>
        /// <response code="200">Lista de usuários retornada com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        /// <summary>Busca um usuário específico pelo ID.</summary>
        /// <param name="id">ID do usuário a ser buscado.</param>
        /// <response code="200">Usuário encontrado e retornado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="404">Usuário não encontrado.</response>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "USER_NOT_FOUNDED" });
            }
            return Ok(user);
        }

        /// <summary>Atualiza os dados de um usuário existente.</summary>
        /// <param name="id">ID do usuário a ser atualizado.</param>
        /// <response code="200">Usuário atualizado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="404">Usuário não encontrado.</response>
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            var user = await _userService.UpdateUserAsync(id, request);
            if (user == null)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(user);
        }

        /// <summary>Exclui um usuário do sistema.</summary>
        /// <param name="id">ID do usuário a ser excluído.</param>
        /// <response code="200">Usuário excluído com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="404">Usuário não encontrado.</response>
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(new { message = "USER_DELETE_SUCCESSFULY" });
        }

        /// <summary>Busca os dados do próprio usuário logado (Perfil).</summary>
        /// <response code="200">Perfil encontrado e retornado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="404">Usuário não encontrado.</response>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMe()
        {
            var email = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(user);
        }

        /// <summary>Atualiza os dados do próprio usuário logado (Perfil).</summary>
        /// <param name="request">Dados a serem atualizados.</param>
        /// <response code="200">Perfil atualizado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="404">Usuário não encontrado.</response>
        [HttpPut("me")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateUserRequest request)
        {
            var email = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var currentUser = await _userService.GetUserByEmailAsync(email);
            if (currentUser == null)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            var updatedUser = await _userService.UpdateUserAsync(currentUser.Id, request);
            if (updatedUser == null)
            {
                return NotFound(new { message = "USER_NOT_FOUND" });
            }

            return Ok(updatedUser);
        }
    }
}