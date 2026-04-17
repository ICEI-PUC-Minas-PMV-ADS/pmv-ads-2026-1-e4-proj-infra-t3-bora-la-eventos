using System.Runtime.CompilerServices;
using BoraLaBackend.Models;
using BoraLaBackend.Shared.Database;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Comments.Repositories
{
  public class CommentsRepository : ICommentsRepository
  {
    private readonly IMongoCollection<Comment> _comments;

    public CommentsRepository(IMongoClient client, IOptions<MongoSettings> settings)
    {
      var db = client.GetDatabase(settings.Value.DatabaseName);
      _comments = db.GetCollection<Comment>("comments");
    }

    public async Task<List<Comment>> GetAllComments(string id)
    {
      return await _comments
                .Find(c => c.EventId == id)
                .SortByDescending(c => c.CreatedAt)
                .ToListAsync();
    }

    public async Task<bool> CreateComment(Comment co)
    {
      try
      {
        await _comments.InsertOneAsync(co);
        return true;
      }
      catch
      {
        return false;
      }
    }

    public async Task<Comment> GetCommentById(string id)
    {
      return await _comments.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Comment> UpdateComment(string id, string body)
    {
      return await _comments.FindOneAndUpdateAsync(
                c => c.Id == id,
                Builders<Comment>.Update.Set(c => c.Text, body),
                new FindOneAndUpdateOptions<Comment> { ReturnDocument = ReturnDocument.After }
            );
    }

    public async Task<DeleteResult> DeleteComment(string id)
    {
      return await _comments.DeleteOneAsync(c => c.Id == id); 
    }
  }
}