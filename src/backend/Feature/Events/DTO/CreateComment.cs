using System.ComponentModel.DataAnnotations;

namespace BoraLaBackend.Feature.Events.DTO;

public record CreateCommentDto(
    [Required] string EventId,
    [Required] string UserId,
    [Required][MaxLength(1000)] string Text
);

public record UpdateCommentDto(
    [Required][MaxLength(1000)] string Text
);

public record CommentResponseDto(
    string Id,
    string EventId,
    string UserId,
    string Text,
    DateTime CreatedAt
);