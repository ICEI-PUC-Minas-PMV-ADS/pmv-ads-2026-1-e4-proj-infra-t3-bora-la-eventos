namespace BoraLaBackend.Feature.Authentication.DTO
{
  public class AuthTokenReqDto
  {
    public string ClientSecret { get; set; }
    public string ClientID { get; set; }
  }
}