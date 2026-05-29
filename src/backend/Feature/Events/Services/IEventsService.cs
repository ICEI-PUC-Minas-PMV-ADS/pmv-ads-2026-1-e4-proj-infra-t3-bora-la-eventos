using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Services
{
    public interface IEventsService
    {
        Task<(CreateEventResult result, Event? evt)> CreateEventAsync(string organizerId, CreateEventRequest request);
        Task<IEnumerable<EventFeedResponse>> GetFeedAsync();
        Task<IEnumerable<EventFeedResponse>> GetMyEventsAsync(string organizerId);
        Task<EventFeedResponse?> GetEventByIdAsync(string id);
        Task<IEnumerable<EventFeedResponse>> SearchEventsAsync(string? name, string? category);
        Task<IEnumerable<EventFeedResponse>> GetNearbyEventsAsync(double longitude, double latitude, double radiusInKm);
        Task<(EventOperationResult result, Event? evt)> UpdateEventAsync(string organizerId, string eventId, UpdateEventRequest request);
        Task<EventOperationResult> DeleteEventAsync(string organizerId, string eventId);
        Task ToggleLikeAsync(string userId, string eventId);
        Task<int> CountLikesAsync(string eventId);
        Task<IEnumerable<EventFeedResponse>> GetLiked(string userId);
    }
}
