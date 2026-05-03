using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Feature.Events.Services;
using BoraLaBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.Events
{
    [Authorize]
    [Route("events")]
    [ApiController]
    [Produces("application/json")]
    public class EventsController : ControllerBase
    {
        private readonly IEventsService _eventsService;

        public EventsController(IEventsService eventsService)
        {
            _eventsService = eventsService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetFeed()
        {
            var feed = await _eventsService.GetFeedAsync();
            return Ok(feed);
        }

        /// <summary>Busca eventos por nome ou categoria.</summary>
        /// <remarks>Permite buscar eventos por título (busca parcial, case-insensitive) e/ou categoria (busca exata).</remarks>
        /// <param name="name">Parte do título do evento para buscar (opcional).</param>
        /// <param name="category">Categoria exata do evento (opcional).</param>
        /// <response code="200">Lista de eventos encontrados.</response>
        [HttpGet("search")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<EventFeedResponse>), 200)]
        public async Task<IActionResult> SearchEvents([FromQuery] string? name, [FromQuery] string? category)
        {
            if (string.IsNullOrWhiteSpace(name) && string.IsNullOrWhiteSpace(category))
                return BadRequest(new { message = "At least one search parameter (name or category) is required" });

            var results = await _eventsService.SearchEventsAsync(name, category);
            return Ok(results);
        }

        /// <summary>Busca eventos por proximidade geográfica.</summary>
        /// <remarks>Retorna eventos dentro do raio informado. Requer que os eventos tenham coordenadas cadastradas (latitude/longitude).</remarks>
        /// <param name="latitude">Latitude do ponto central da busca.</param>
        /// <param name="longitude">Longitude do ponto central da busca.</param>
        /// <param name="radiusKm">Raio de busca em quilômetros (padrão: 10km).</param>
        /// <response code="200">Lista de eventos encontrados no raio.</response>
        /// <response code="400">Parâmetros de latitude ou longitude inválidos.</response>
        [HttpGet("nearby")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<EventFeedResponse>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetNearbyEvents([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] double radiusKm = 10)
        {
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
                return BadRequest(new { message = "Invalid latitude or longitude values" });

            var results = await _eventsService.GetNearbyEventsAsync(longitude, latitude, radiusKm);
            return Ok(results);
        }

        /// <summary>Cria um novo evento.</summary>
        /// <remarks>Apenas organizadores (cadastrados com CNPJ) podem criar eventos.</remarks>
        /// <response code="201">Evento criado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="403">Usuário autenticado não é um organizador.</response>
        /// <response code="404">Organizador não encontrado.</response>
        [HttpPost]
        [ProducesResponseType(typeof(Event), 201)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
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

        /// <summary>Edita um evento existente.</summary>
        /// <remarks>Apenas o organizador que criou o evento pode editá-lo. Todos os campos são opcionais — somente os enviados serão atualizados.</remarks>
        /// <param name="id">ID do evento a ser editado.</param>
        /// <response code="200">Evento atualizado com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="403">Usuário autenticado não é o organizador deste evento.</response>
        /// <response code="404">Evento ou organizador não encontrado.</response>
        [HttpPatch("{id}")]
        [ProducesResponseType(typeof(Event), 200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateEvent(string id, [FromBody] UpdateEventRequest request)
        {
            var email = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var (result, evt) = await _eventsService.UpdateEventAsync(email, id, request);

            return result switch
            {
                EventOperationResult.Success => Ok(evt),
                EventOperationResult.EventNotFound => NotFound(new { message = "EVENT_NOT_FOUND" }),
                EventOperationResult.UserNotFound => NotFound(new { message = "USER_NOT_FOUND" }),
                EventOperationResult.NotTheOrganizer => StatusCode(403, new { message = "FORBIDDEN_NOT_THE_ORGANIZER" }),
                _ => StatusCode(500)
            };
        }

        /// <summary>Exclui um evento.</summary>
        /// <remarks>Apenas o organizador que criou o evento pode excluí-lo.</remarks>
        /// <param name="id">ID do evento a ser excluído.</param>
        /// <response code="200">Evento excluído com sucesso.</response>
        /// <response code="401">Token ausente ou inválido.</response>
        /// <response code="403">Usuário autenticado não é o organizador deste evento.</response>
        /// <response code="404">Evento ou organizador não encontrado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            var email = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var result = await _eventsService.DeleteEventAsync(email, id);

            return result switch
            {
                EventOperationResult.Success => Ok(new { message = "EVENT_DELETED_SUCCESSFULLY" }),
                EventOperationResult.EventNotFound => NotFound(new { message = "EVENT_NOT_FOUND" }),
                EventOperationResult.UserNotFound => NotFound(new { message = "USER_NOT_FOUND" }),
                EventOperationResult.NotTheOrganizer => StatusCode(403, new { message = "FORBIDDEN_NOT_THE_ORGANIZER" }),
                _ => StatusCode(500)
            };
        }

        /// <summary>Curte um evento</summary>
        /// <remarks>Apenas o organizador que criou o evento pode excluí-lo.</remarks>
        [HttpPost("{eventId}/like")]
        public async Task<IActionResult> ToggleLike(string eventId)
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId)) 
                return Unauthorized();

            await _eventsService.ToggleLikeAsync(userId, eventId);

            return Ok(new {message = "LIKE_TOGGLED"});
        }

        [HttpGet("{eventId}/likes")]
        [AllowAnonymous]

        public async Task<IActionResult> GetLikes(string eventId)
        {
            var count = await _eventsService.CountLikesAsync(eventId);
            return Ok(new {likes = count});
        }
    }
}
