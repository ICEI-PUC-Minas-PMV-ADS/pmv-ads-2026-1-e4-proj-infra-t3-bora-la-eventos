namespace BoraLaBackend.Shared.Security
{
    public class PasswordService : IPasswordService
    {
        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}