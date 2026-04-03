using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Users.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(string id);
        Task<List<User>> GetAllAsync();
        Task CreateAsync(User user);
        Task UpdateAsync(string id, User user);
        Task DeleteAsync(string id);
    }
}