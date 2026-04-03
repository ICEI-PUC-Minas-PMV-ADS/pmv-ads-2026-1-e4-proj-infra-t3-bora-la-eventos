namespace BoraLaBackend.Shared.Security
{
    public interface IPasswordService
    {
        string Hash(string password);
    }
}