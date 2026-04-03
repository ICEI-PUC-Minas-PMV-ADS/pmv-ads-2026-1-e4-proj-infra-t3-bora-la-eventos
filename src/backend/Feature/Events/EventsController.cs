using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Feature.Events.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.Events
{
    [Authorize]
    [Route("events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventsService _eventsService;

        public EventsController(IEventsService eventsService)
        {
            _eventsService = eventsService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            var email = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var (result, evt) = await _eventsService.CreateEventAsync(email, request);

            return result switch
            {
                CreateEventResult.Success => CreatedAtAction(nameof(CreateEvent), new { id = evt!.Id }, evt),
                CreateEventResult.UserNotFound => NotFound(new { message = "USER_NOT_FOUND" }),
                CreateEventResult.NotAnOrganizer => StatusCode(403, new { message = "FORBIDDEN_ORGANIZER_ONLY" }),
                _ => StatusCode(500)
            };
        }
    }
}
