namespace BoraLaBackend.Feature.Users.DTO
{
    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Document { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
