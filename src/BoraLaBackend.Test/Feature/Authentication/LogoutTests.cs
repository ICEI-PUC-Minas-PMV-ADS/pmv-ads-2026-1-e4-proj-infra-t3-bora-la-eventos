using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Models;
using BoraLaBackend.Shared.Security;
using Microsoft.Extensions.Configuration;
using Moq;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;

namespace BoraLaBackend.Feature.Authentication
{
    public class LogoutTests
    {
        [Test]
        public async Task Logout_Should_Return_Success_And_Increment_TokenVersion_When_Token_Is_Valid()
        {
            // Arrange
            string secretKey = "chave-secreta-para-testes-unitarios";

            var configMock = new Mock<IConfiguration>();
            configMock.Setup(c => c["Auth:ServerSecret"]).Returns(secretKey);

            var jwtMock = new Mock<IJwtService>();
            var userRepoMock = new Mock<IUserRepository>();
            var blRepoMock = new Mock<IBlackListRepository>();
            var passMock = new Mock<IPasswordService>();

            // 1. Criar um usuário mockado
            var mockUser = new User
            {
                Id = "user123",
                Email = "teste@teste.com",
                TokenVersion = 1
            };

            userRepoMock
                .Setup(u => u.GetByEmailAsync("teste@teste.com"))
                .ReturnsAsync(mockUser);

            userRepoMock
                .Setup(u => u.UpdateAsync("user123", It.IsAny<User>()))
                .Returns(Task.FromResult<User?>(mockUser));

            // 2. Gerar um Token real válido para o AuthService conseguir decodificar
            var encoder = new JwtEncoder(new HMACSHA256Algorithm(), new JsonNetSerializer(), new JwtBase64UrlEncoder());
            var payload = new Dictionary<string, object>
            {
                { "email", "teste@teste.com" },
                { "exp", DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds() }
            };
            string validToken = encoder.Encode(payload, secretKey);

            var service = new AuthService(
                configMock.Object,
                jwtMock.Object,
                passMock.Object,
                userRepoMock.Object,
                blRepoMock.Object
            );

            // Act
            var result = await service.Logout($"Bearer {validToken}");

            // Assert
            Assert.That(result.HasError, Is.False, "O logout não deve retornar erro.");
            Assert.That(mockUser.TokenVersion, Is.EqualTo(2), "O TokenVersion do usuário deveria ter sido incrementado.");

            // Verifica se o update foi chamado enviando o usuário correto com a versão salva
            userRepoMock.Verify(u => u.UpdateAsync("user123", It.Is<User>(user => user.TokenVersion == 2)), Times.Once);
        }

        [Test]
        public async Task Logout_Should_Return_Unprocessable_When_Token_Is_Invalid()
        {
            // Arrange
            var configMock = new Mock<IConfiguration>();
            configMock.Setup(c => c["Auth:ServerSecret"]).Returns("chave-secreta");

            var service = new AuthService(
                configMock.Object,
                new Mock<IJwtService>().Object,
                new Mock<IPasswordService>().Object,
                new Mock<IUserRepository>().Object,
                new Mock<IBlackListRepository>().Object
            );

            // Act
            var result = await service.Logout("Bearer token-totalmente-invalido");

            // Assert
            Assert.That(result.HasError, Is.True);
            Assert.That(result.ErrorCode, Is.EqualTo(Enums.ErrorMessageCode.UNPROCESSABLE_ENTITY));
        }
    }
}