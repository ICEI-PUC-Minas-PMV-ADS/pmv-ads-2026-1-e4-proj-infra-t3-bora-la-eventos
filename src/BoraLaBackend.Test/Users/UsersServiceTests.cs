using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Feature.Users.Enums;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Feature.Users.Services;
using BoraLaBackend.Models;
using BoraLaBackend.Shared.Security;
using Moq;

namespace BoraLaBackend.Test.Users
{
    [TestFixture]
    public class UsersServiceTests
    {
        private Mock<IUserRepository> _userRepositoryMock;
        private Mock<IPasswordService> _passwordServiceMock;
        private UsersService _usersService;

        [SetUp]
        public void Setup()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _passwordServiceMock = new Mock<IPasswordService>();
            _usersService = new UsersService(_userRepositoryMock.Object, _passwordServiceMock.Object);
        }

        [Test]
        public async Task RegisterAsync_EmailExists_ReturnsEmailExists()
        {
            // Arrange
            var request = new RegisterRequest
            {
                Email = "test@test.com",
                Document = "22641859025", 
                Name = "Test",
                Password = "pwd"
            };

            _userRepositoryMock.Setup(r => r.GetByEmailAsync(request.Email))
                .ReturnsAsync(new User { Email = request.Email });

            // Act
            var result = await _usersService.RegisterAsync(request);

            // Assert
            Assert.That(result, Is.EqualTo(RegisterResult.EmailExists));
        }

        [Test]
        public async Task RegisterAsync_DocumentExists_ReturnsDocumentExists()
        {
            // Arrange
            var request = new RegisterRequest
            {
                Email = "test@test.com",
                Document = "22641859025",
                Name = "Test",
                Password = "pwd"
            };

            _userRepositoryMock.Setup(r => r.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);
            _userRepositoryMock.Setup(r => r.GetByDocumentAsync(request.Document))
                .ReturnsAsync(new User { Document = request.Document });

            // Act
            var result = await _usersService.RegisterAsync(request);

            // Assert
            Assert.That(result, Is.EqualTo(RegisterResult.DocumentExists));
        }

        [Test]
        public async Task GetAllUsersAsync_ReturnsUserList()
        {
            // Arrange
            var users = new List<User> { new User { Id = "1", Name = "User 1" }, new User { Id = "2", Name = "User 2" } };
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(users);

            // Act
            var result = await _usersService.GetAllUsersAsync();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task GetUserByIdAsync_UserExists_ReturnsUser()
        {
            // Arrange
            var user = new User { Id = "123", Name = "Test User" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync(user);

            // Act
            var result = await _usersService.GetUserByIdAsync("123");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo("123"));
        }

        [Test]
        public async Task GetUserByIdAsync_UserDoesNotExist_ReturnsNull()
        {
            // Arrange
            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync((User?)null);

            // Act
            var result = await _usersService.GetUserByIdAsync("123");

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task UpdateUserAsync_UserDoesNotExist_ReturnsNull()
        {
            // Arrange
            var request = new UpdateUserRequest { Name = "New Name" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync((User?)null);

            // Act
            var result = await _usersService.UpdateUserAsync("123", request);

            // Assert
            Assert.That(result, Is.Null);
            _userRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<User>()), Times.Never);
        }

        [Test]
        public async Task UpdateUserAsync_UserExists_UpdatesAndReturnsUser()
        {
            // Arrange
            var existingUser = new User { Id = "123", Name = "Old Name", Email = "old@test.com" };
            var request = new UpdateUserRequest { Name = "New Name" };

            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync(existingUser);

            // Act
            var result = await _usersService.UpdateUserAsync("123", request);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("New Name"));
            Assert.That(result.Email, Is.EqualTo("old@test.com"));
            _userRepositoryMock.Verify(r => r.UpdateAsync("123", existingUser), Times.Once);
        }

        [Test]
        public async Task DeleteUserAsync_UserDoesNotExist_ReturnsFalse()
        {
            // Arrange
            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync((User?)null);

            // Act
            var result = await _usersService.DeleteUserAsync("123");

            // Assert
            Assert.That(result, Is.False);
            _userRepositoryMock.Verify(r => r.DeleteAsync(It.IsAny<string>()), Times.Never);
        }

        [Test]
        public async Task DeleteUserAsync_UserExists_ReturnsTrueAndDeletes()
        {
            // Arrange
            var user = new User { Id = "123" };
            _userRepositoryMock.Setup(r => r.GetByIdAsync("123")).ReturnsAsync(user);

            // Act
            var result = await _usersService.DeleteUserAsync("123");

            // Assert
            Assert.That(result, Is.True);
            _userRepositoryMock.Verify(r => r.DeleteAsync("123"), Times.Once);
        }
    }
}