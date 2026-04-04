using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Services
{
    public interface IEventsService
    {
        Task<(CreateEventResult result, Event? evt)> CreateEventAsync(string organizerEmail, CreateEventRequest request);
        Task<(EventOperationResult result, Event? evt)> UpdateEventAsync(string organizerEmail, string eventId, UpdateEventRequest request);
        Task<EventOperationResult> DeleteEventAsync(string organizerEmail, string eventId);
    }
}
