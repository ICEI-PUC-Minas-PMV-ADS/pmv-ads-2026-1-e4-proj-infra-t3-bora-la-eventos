using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Models;
using MongoDB.Driver;

namespace BoraLaBackend.Feature.Comments.Services
{
    public class CommentService : ICommentService
    {
        private readonly IMongoCollection<Comment> _comments;

        public CommentService(IMongoDatabase database)
        {
            _comments = database.GetCollection<Comment>("comments");

            var indexKeys = Builders<Comment>.IndexKeys.Ascending(c => c.EventId);
            _comments.Indexes.CreateOne(new CreateIndexModel<Comment>(indexKeys));
        }

        public async Task<IEnumerable<CommentResponseDto>> GetByEventIdAsync(string eventId)
        {
            var comments = await _comments
                .Find(c => c.EventId == eventId)
                .SortByDescending(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(ToDto);
        }

        public async Task<CommentResponseDto> CreateAsync(CreateCommentDto dto)
        {
            var comment = new Comment
            {
                EventId = dto.EventId,
                UserId = dto.UserId,
                Text = dto.Text,
                CreatedAt = DateTime.UtcNow
            };

            await _comments.InsertOneAsync(comment);
            return ToDto(comment);
        }

        public async Task<CommentResponseDto?> UpdateAsync(string commentId, string requesterId, bool isOrganizer, UpdateCommentDto dto)
        {
            var comment = await _comments.Find(c => c.Id == commentId).FirstOrDefaultAsync();

            if (comment is null) return null;

            if (comment.UserId != requesterId)
                throw new UnauthorizedAccessException("Apenas o autor pode editar o comentário.");

            var update = Builders<Comment>.Update
                .Set(c => c.Text, dto.Text);

            var result = await _comments.FindOneAndUpdateAsync(
                c => c.Id == commentId,
                update,
                new FindOneAndUpdateOptions<Comment> { ReturnDocument = ReturnDocument.After }
            );

            return result is null ? null : ToDto(result);
        }

        public async Task<bool> DeleteAsync(string commentId, string requesterId, bool isOrganizer)
        {
            var comment = await _comments.Find(c => c.Id == commentId).FirstOrDefaultAsync();

            if (comment is null) return false;

            if (!isOrganizer && comment.UserId != requesterId)
                throw new UnauthorizedAccessException("Sem permissão para excluir este comentário.");

            var result = await _comments.DeleteOneAsync(c => c.Id == commentId);
            return result.DeletedCount > 0;
        }

        private static CommentResponseDto ToDto(Comment c) => new(
            c.Id!,
            c.EventId,
            c.UserId,
            c.Text,
            c.CreatedAt
        );
    }
}