using BoraLaBackend.Feature.Comments.Repositories;
using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Comments.Services
{
    public class CommentService(ICommentsRepository comments) : ICommentService
    {
        private readonly ICommentsRepository _comments = comments;

        public async Task<IEnumerable<CommentResponseDto>> GetByEventIdAsync(string eventId)
        {
            List<Comment> co = await _comments.GetAllComments(eventId);
            return co.Select(ToDto);
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

            bool wasCreated = await _comments.CreateComment(comment);
            if (!wasCreated) {
                // TODO: Precisa criar o processo de validação de erro
                return ToDto(comment);
            }
            return ToDto(comment);
        }

        public async Task<CommentResponseDto?> UpdateAsync(string commentId, string requesterId, bool isOrganizer, UpdateCommentDto dto)
        {
            var comment = await _comments.GetCommentById(commentId);

            if (comment is null) return null;

            if (comment.UserId != requesterId)
                throw new UnauthorizedAccessException("Apenas o autor pode editar o comentário.");

            try
            {
                var response = await _comments.UpdateComment(commentId, dto.Text);
                return ToDto(response);
                
            } catch
            {
                return  null; 
            }
        }

        public async Task<bool> DeleteAsync(string commentId, string requesterId, bool isOrganizer)
        {
            var comment = await _comments.GetCommentById(commentId);

            if (comment is null) return false;

            if (!isOrganizer && comment.UserId != requesterId)
                throw new UnauthorizedAccessException("Sem permissão para excluir este comentário.");

            var result = await _comments.DeleteComment(commentId);
            return result.DeletedCount > 0;
        }

        private static CommentResponseDto ToDto(Comment c) => new(
            c.Id,
            c.EventId,
            c.UserId,
            c.Text,
            c.CreatedAt
        );
    }
}