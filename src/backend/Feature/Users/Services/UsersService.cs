using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Shared.Security;
using BoraLaBackend.Models;
using BoraLaBackend.Utils;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Feature.Users.Enums;

namespace BoraLaBackend.Feature.Users.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUserRepository _repo;
        private readonly IPasswordService _passwordService;

        public UsersService(IUserRepository repo, IPasswordService passwordService)
        {
            _repo = repo;
            _passwordService = passwordService;
        }

        public async Task<RegisterResult> RegisterAsync(RegisterRequest request)
        {
            if (!DocumentValidator.GetRoleFromDocument(request.Document, out var role))
            {
                return RegisterResult.InvalidDocument;
            }

            var existsEmail = await _repo.GetByEmailAsync(request.Email);
            if (existsEmail != null)
            {
                return RegisterResult.EmailExists;
            }

            var existsDocument = await _repo.GetByDocumentAsync(request.Document);

            if (existsDocument != null)
            {
                return RegisterResult.DocumentExists;
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Document = request.Document,
                Role = role,
                Password = _passwordService.Hash(request.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                TokenVersion = 0
            };

            await _repo.CreateAsync(user);

            return RegisterResult.Success;
        }

        public async Task<List<UserResponse>> GetAllUsersAsync()
        {
            var users = await _repo.GetAllAsync();
            return users.Select(MapToResponse).ToList();
        }

        public async Task<UserResponse?> GetUserByIdAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            return user == null ? null : MapToResponse(user);
        }

        public async Task<UserResponse?> UpdateUserAsync(string id, UpdateUserRequest request)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            user.Name = request.Name ?? user.Name;
            user.Document = request.Document ?? user.Document;
            user.Email = request.Email ?? user.Email;
            user.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(id, user);

            return MapToResponse(user);
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }

            await _repo.DeleteAsync(id);
            return true;
        }
        public async Task<UserResponse?> GetUserByEmailAsync(string email)
        {
            var user = await _repo.GetByEmailAsync(email);
            return user == null ? null : MapToResponse(user);
        }
        private static UserResponse MapToResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Document = user.Document,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}