namespace BoraLaBackend.Feature.Authentication.DTO
{
  public record TokenResults(bool Status, string? Result = null, string? ErrorMessage = null)
  {
    public static TokenResults Unauthorized => new(false, null,"UNAUTHORIZED");
    public static TokenResults Error => new(false, null, "INTERNAL_SERVER_ERROR");
    public static TokenResults Success(string token) => new(true, token);
  }
}