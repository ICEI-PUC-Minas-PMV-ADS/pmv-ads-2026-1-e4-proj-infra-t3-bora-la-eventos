using BoraLaBackend.Models;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Comments.Repositories
{
  public interface ICommentsRepository
  {
    public Task<List<Comment>> GetAllComments(string id);

    public Task<bool> CreateComment(Comment co);

    public Task<Comment> GetCommentById(string id);

    public Task<Comment> UpdateComment(string id, string body);

    public Task<DeleteResult> DeleteComment(string id);
  }
}