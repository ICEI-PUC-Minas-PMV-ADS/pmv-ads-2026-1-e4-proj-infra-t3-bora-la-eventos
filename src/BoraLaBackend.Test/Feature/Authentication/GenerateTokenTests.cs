using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Shared.Security;
using Microsoft.Extensions.Configuration;
using Moq;

namespace BoraLaBackend.Feature.Authentication
{
  [TestFixture]
  public class GenerateTokenTests
  {
    [Test]
    public void GenerateToken_Should_Return_Unauthorized_When_Invalid_Credentials()
    {
      // Arrange
      var configMock = new Mock<IConfiguration>();
      var jwtMock = new Mock<IJwtService>();
      var userRepoMock = new Mock<IUserRepository>();
      var blRepoMock = new Mock<IBlackListRepository>();
      var passMock = new Mock<IPasswordService>();

      configMock.Setup(x => x["Auth:ClientID"]).Returns("correct");
      configMock.Setup(x => x["Auth:ClientSecret"]).Returns("secret");

      var service = new AuthService(
          configMock.Object,
          jwtMock.Object,
          passMock.Object,
          userRepoMock.Object,
          blRepoMock.Object
      );

      // Act
      var result = service.GenerateToken("wrong", "wrong");

      // Assert
      Assert.That(result.Status, Is.False);
      Assert.That(result.ErrorMessage, Is.EqualTo("UNAUTHORIZED"));
    }
  }
}