namespace BoraLaBackend.Shared.Security
{

    public record ValidateTokenReturnProps(string Jti, DateTime Date);
    public interface IJwtService
    {
        public string GenerateToken(string appId, string? userId, string? email = null, int? tokenVersion = null);

        public bool ValidateToken(string token);

        public ValidateTokenReturnProps? InvalidateToken(string token);

        public string? GetClaimFromToken(string token, string claimKey);

    }


}