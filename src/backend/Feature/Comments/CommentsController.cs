using BoraLaBackend.Feature.Comments.Services;
using BoraLaBackend.Feature.Events.DTO;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.Comments;

// ROOT PATH
[ApiController]
[Route("comments")]
[Produces("application/json")]
public class CommentsController(ICommentService service): ControllerBase
{
    private readonly ICommentService _service = service;

    // GET /comments/eventId
    [HttpGet("{eventId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEvent([FromRoute] string eventId)
    {
        if (eventId == null) return BadRequest();
        var comments = await _service.GetByEventIdAsync(eventId);
        return Ok(comments);
    }

    // POST comments/
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

    // POST comments/id
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

    // POST comments/id
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