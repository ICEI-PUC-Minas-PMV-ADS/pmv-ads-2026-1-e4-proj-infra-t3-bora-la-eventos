namespace BoraLaBackend.Shared.Security
{
    public interface IPasswordService
    {
        string Hash(string password);
        public bool Check(string received, string fromDatabas);
    }
}