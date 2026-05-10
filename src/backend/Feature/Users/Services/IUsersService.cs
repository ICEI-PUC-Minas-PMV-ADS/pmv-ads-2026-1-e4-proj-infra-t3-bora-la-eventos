using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Feature.Users.Enums;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Users.Services
{
    public interface IUsersService
    {
        Task<RegisterResult> RegisterAsync(RegisterRequest request);
        Task<List<UserResponse>> GetAllUsersAsync();

        Task<UserResponse?> GetUserByEmailAsync(string email);
        Task<UserResponse?> GetUserByIdAsync(string id);
        Task<UserResponse?> UpdateUserAsync(string id, UpdateUserRequest request);
        Task<bool> DeleteUserAsync(string id);
    }
}