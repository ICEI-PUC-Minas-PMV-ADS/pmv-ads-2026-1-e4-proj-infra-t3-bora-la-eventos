namespace BoraLaBackend.Shared.Security
{

    public record ValidateTokenReturnProps(string Jti, DateTime Date);
    public interface IJwtService
    {
        public string GenerateToken(string appId, string? email);

        public bool ValidateToken(string token);

        public ValidateTokenReturnProps? InvalidateToken(string token);
    }


}