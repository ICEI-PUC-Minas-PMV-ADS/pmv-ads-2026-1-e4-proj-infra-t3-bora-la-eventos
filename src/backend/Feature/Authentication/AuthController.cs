using BoraLaBackend.Feature.Authentication.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BoraLaBackend.Feature.Authentication.Services.Interfaces;
using BoraLaBackend.Shared.Utils.Interfaces;
using BoraLaBackend.Feature.Authentication.Enums;

namespace BoraLaBackend.Feature.Authentication
{
    [Route("auth")]
    [ApiController]
    public class AuthController(
      IAuthService service,
      IEnumHelper enumHelper
    ) : ControllerBase
    {
        private readonly IAuthService _service = service;
        private readonly IEnumHelper _helper = enumHelper;

        // POST /auth/pre-login
        [HttpPost("pre-login")]
        [AllowAnonymous]
        public IActionResult AppAuthorization([FromBody] AuthTokenReqDto request)
        {
            if (string.IsNullOrEmpty(request.ClientSecret) || string.IsNullOrEmpty(request.ClientID))
                return BadRequest(new { code = "INVALID_BODY" });

            TokenResults result = _service.GenerateToken(request.ClientID, request.ClientSecret);

            if (!result.Status)
            {
                return result.ErrorMessage == "UNAUTHORIZED" ? Unauthorized() : StatusCode(500);
            }
            return Ok(new { token = $"Bearer {result.Result}" });
        }

        // POST: /auth/login
        [HttpPost("login")]
        [Authorize]
        public async Task<IActionResult> Login(
            [FromBody] SignInRequestDto props,
            [FromHeader(Name = "x-request-id")] string appId
        )
        {
            if (string.IsNullOrEmpty(props.Email) || string.IsNullOrEmpty(props.Password) || string.IsNullOrEmpty(appId))
            {
                return BadRequest();
            }

            AuthResults result = await _service.Login(props.Email, props.Password, appId);
            if (result.HasError)
            {
                var code = result.ErrorCode ?? ErrorMessageCode.INTERNAL_SERVER_ERROR;
                string name = _helper.GetName<ErrorMessageCode>((int)code, "INTERNAL_SERVER_ERROR");
                return result.ErrorCode switch
                {
                    ErrorMessageCode.INTERNAL_SERVER_ERROR => StatusCode(500, new { message = name }),
                    ErrorMessageCode.INVALID_HEADER => BadRequest(new { message = name }),
                    ErrorMessageCode.INVALID_BODY => UnprocessableEntity(),
                    ErrorMessageCode.NOT_FOUNDED => NotFound(),
                    ErrorMessageCode.UNAUTHORIZED => Unauthorized(),
                    _ => StatusCode(500)
                };

            }
            return Ok(new { currentUser = result.Result.CurrentUser, token = $"Bearer {result.Result.Token}" });
        }

        // POST: /auth/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string authToken)
        {

            if (string.IsNullOrEmpty(authToken) || !authToken.StartsWith("Bearer "))
                return NotFound("parameter_not_founded");

            AuthResults result = await _service.Logout(authToken);

            if (result.HasError)
            {
                var code = result.ErrorCode ?? ErrorMessageCode.INTERNAL_SERVER_ERROR;
                string name = _helper.GetName<ErrorMessageCode>((int)code, "INTERNAL_SERVER_ERROR");
                return result.ErrorCode switch
                {
                    ErrorMessageCode.INTERNAL_SERVER_ERROR => StatusCode(500, new { message = name }),
                    ErrorMessageCode.UNPROCESSABLE_ENTITY => UnprocessableEntity(),
                    _ => StatusCode(500)
                };
            }
            return Ok();
        }
    }
}
