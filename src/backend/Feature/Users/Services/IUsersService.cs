using BoraLaBackend.Feature.Users.DTO;
using BoraLaBackend.Feature.Users.Enums;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Users.Services
{
    public interface IUsersService
    {
        Task<RegisterResult> RegisterAsync(RegisterRequest request);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> UpdateUserAsync(string id, UpdateUserRequest request);
        Task<bool> DeleteUserAsync(string id);
    }
}