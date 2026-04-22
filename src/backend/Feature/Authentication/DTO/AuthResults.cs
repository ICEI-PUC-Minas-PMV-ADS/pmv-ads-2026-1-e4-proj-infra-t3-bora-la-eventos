using BoraLaBackend.Feature.Authentication.Enums;
using BoraLaBackend.Models;
using BoraLaBackend.Feature.Users.DTO;

namespace BoraLaBackend.Feature.Authentication.DTO
{
  public record LoginReturn(UserResponse CurrentUser, string Token);

  public record LogoutRetun(BlacklistedToken? Data, bool Status);

  public record AuthResults(bool HasError, ErrorMessageCode? ErrorCode = null, LoginReturn? Result = null)
  {
    public static AuthResults ServerError => new(true, ErrorMessageCode.INTERNAL_SERVER_ERROR, null);
    public static AuthResults BadRequest => new(true,  ErrorMessageCode.BAD_REQUEST, null);
    public static AuthResults NotFounded => new(true,  ErrorMessageCode.NOT_FOUNDED, null);
    public static AuthResults InvalidBody => new(true,  ErrorMessageCode.INVALID_BODY, null);
    public static AuthResults Unprocessable => new(true, ErrorMessageCode.UNPROCESSABLE_ENTITY, null); 
    public static AuthResults Unauthorized => new(true, ErrorMessageCode.UNAUTHORIZED, null); 
    public static AuthResults LoginSuccess(LoginReturn result) => new(false, null, result);
    public static AuthResults LogoutSuccess() => new(false, null, null);
  }
}