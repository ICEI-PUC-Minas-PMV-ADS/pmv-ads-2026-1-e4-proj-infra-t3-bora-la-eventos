namespace BoraLaBackend.Shared.Security
{
    public class PasswordService : IPasswordService
    {
        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Check(string received, string fromDatabase)
        {
            return BCrypt.Net.BCrypt.Verify(received, fromDatabase);
        }
    }
}