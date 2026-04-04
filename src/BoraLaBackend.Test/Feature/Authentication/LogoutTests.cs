using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Models;
using BoraLaBackend.Shared.Security;
using Microsoft.Extensions.Configuration;
using Moq;

namespace BoraLaBackend.Feature.Authentication
{
  public class LogoutTests
  {
    [Test]
    public async Task Logout_Should_Return_Success_When_Token_Is_Valid()
    {
      // Arrange
      var configMock = new Mock<IConfiguration>();
      var jwtMock = new Mock<IJwtService>();
      var userRepoMock = new Mock<IUserRepository>();
      var blRepoMock = new Mock<IBlackListRepository>();
      var passMock = new Mock<IPasswordService>();

      ValidateTokenReturnProps tokenData = new("abc123",DateTime.UtcNow.AddMinutes(10));

      jwtMock
          .Setup(j => j.InvalidateToken("token123"))
          .Returns(tokenData);

      blRepoMock
          .Setup(r => r.Insert(It.IsAny<BlacklistedToken>()))
          .Returns(Task.CompletedTask);

      var service = new AuthService(
          configMock.Object,
          jwtMock.Object,
          passMock.Object,
          userRepoMock.Object,
          blRepoMock.Object
      );

      // Act
      var result = await service.Logout("Bearer token123");

      // Assert
      Assert.That(result.HasError, Is.False);
    }
  }
}