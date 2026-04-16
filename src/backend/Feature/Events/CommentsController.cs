using BoraLaBackend.Feature.Events.Services;
using BoraLaBackend.Feature.Events.DTO;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.Events;

[ApiController]
[Route("api/events/{eventId}/comments")]
[Produces("application/json")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _service;

    public CommentsController(ICommentService service)
    {
        _service = service;
    }

    /// Lista todos os comentários de um evento
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEvent([FromRoute] string eventId)
    {
        var comments = await _service.GetByEventIdAsync(eventId);
        return Ok(comments);
    }

    /// Cria um comentário em um evento (RF-008)
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromRoute] string eventId,
        [FromBody] CreateCommentDto dto)
    {
        if (dto.EventId != eventId)
            return BadRequest("EventId inconsistente.");

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByEvent), new { eventId }, created);
    }

    /// Edita um comentário (apenas pelo autor) (RF-008)
    [HttpPut("{commentId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        [FromRoute] string commentId,
        [FromBody] UpdateCommentDto dto,
        [FromHeader(Name = "X-User-Id")] string requesterId,
        [FromHeader(Name = "X-Is-Organizer")] bool isOrganizer = false)
    {
        try
        {
            var updated = await _service.UpdateAsync(commentId, requesterId, isOrganizer, dto);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
        }
    }

    /// Remove um comentário (organizador do evento OU autor)
    [HttpDelete("{commentId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        [FromRoute] string commentId,
        [FromHeader(Name = "X-User-Id")] string requesterId,
        [FromHeader(Name = "X-Is-Organizer")] bool isOrganizer = false)
    {
        try
        {
            var deleted = await _service.DeleteAsync(commentId, requesterId, isOrganizer);
            return deleted ? NoContent() : NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
        }
    }
}