using BoraLaBackend.Feature.Events.DTO;

namespace BoraLaBackend.Feature.Comments.Services;
public interface ICommentService
{
    Task<IEnumerable<CommentResponseDto>> GetByEventIdAsync(string eventId);
    Task<CommentResponseDto> CreateAsync(CreateCommentDto dto);
    Task<CommentResponseDto?> UpdateAsync(string commentId, string requesterId, bool isOrganizer, UpdateCommentDto dto);
    Task<bool> DeleteAsync(string commentId, string requesterId, bool isOrganizer);
}