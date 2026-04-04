using BoraLaBackend.Feature.Authentication.Enums;
using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Shared.Security;
using Microsoft.Extensions.Configuration;
using Moq;


namespace BoraLaBackend.Feature.Authentication
{
  public class LoginTests
  {
    [Test]
    public async Task Login_Should_Return_Success_When_Valid_Credentials()
    {
      // Arrange
      var configMock = new Mock<IConfiguration>();
      var jwtMock = new Mock<IJwtService>();
      var userRepoMock = new Mock<IUserRepository>();
      var blRepoMock = new Mock<IBlackListRepository>();
      var passMock = new Mock<IPasswordService>();

      configMock.Setup(x => x["Auth:ClientID"]).Returns("app-id");

      var fakeUser = new Models.User
      {
        Email = "test@email.com",
        Password = "hashed"
      };

      userRepoMock
          .Setup(r => r.GetByEmailAsync("test@email.com"))
          .ReturnsAsync(fakeUser);

      passMock
          .Setup(p => p.Check("123", "hashed"))
          .Returns(true);

      jwtMock
          .Setup(j => j.GenerateToken("app-id", "test@email.com"))
          .Returns("token123");

      var service = new AuthService(
          configMock.Object,
          jwtMock.Object,
          passMock.Object,
          userRepoMock.Object,
          blRepoMock.Object
      );

      // Act
      var result = await service.Login("test@email.com", "123", "app-id");

      // Assert
      Assert.That(result.HasError, Is.False);
      Assert.That(result.Result.Token, Is.EqualTo("token123"));
      Assert.That(result.Result.CurrentUser, Is.EqualTo(fakeUser));
    }

    [Test]
    public async Task Login_Should_Return_Unauthorized_When_Invalid_Password()
    {
      // Arrange
      var configMock = new Mock<IConfiguration>();
      var jwtMock = new Mock<IJwtService>();
      var userRepoMock = new Mock<IUserRepository>();
      var blRepoMock = new Mock<IBlackListRepository>();
      var passMock = new Mock<IPasswordService>();

      configMock.Setup(x => x["Auth:ClientID"]).Returns("app-id");

      var fakeUser = new Models.User
      {
        Email = "test@email.com",
        Password = "hashed"
      };

      userRepoMock
          .Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
          .ReturnsAsync(fakeUser);

      passMock
          .Setup(p => p.Check(It.IsAny<string>(), It.IsAny<string>()))
          .Returns(false);

      var service = new AuthService(
          configMock.Object,
          jwtMock.Object,
          passMock.Object,
          userRepoMock.Object,
          blRepoMock.Object
      );

      // Act
      var result = await service.Login("test@email.com", "wrong", "app-id");

      // Assert
      Assert.That(result.HasError, Is.True);
      Assert.That(result.ErrorCode, Is.EqualTo(ErrorMessageCode.UNAUTHORIZED));
    }
  }
}