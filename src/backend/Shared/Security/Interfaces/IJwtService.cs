namespace BoraLaBackend.Shared.Security
{

    public record ValidateTokenReturnProps(string Jti, DateTime Date);
    public interface IJwtService
    {
        public string GenerateToken(string appId, string? email, int? tokenVersion = null);

        public bool ValidateToken(string token);

        public ValidateTokenReturnProps? InvalidateToken(string token);
    }


}