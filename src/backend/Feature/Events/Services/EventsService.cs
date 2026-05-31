using System.Security.Cryptography.X509Certificates;
using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Feature.Events.Repository;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.Services
{
    public class EventsService : IEventsService
    {
        private readonly IEventRepository _eventRepo;
        private readonly IUserRepository _userRepo;
        private readonly IEventLikeRepository _likeRepository;

        public EventsService(IEventRepository eventRepo, IUserRepository userRepo, IEventLikeRepository likeRepository)
        {
            _eventRepo = eventRepo;
            _userRepo = userRepo;
            _likeRepository = likeRepository;
        }

        public async Task<(CreateEventResult result, Event? evt)> CreateEventAsync(string organizerId, CreateEventRequest request)
        {
            var user = await _userRepo.GetByIdAsync(organizerId);
            if (user == null)
                return (CreateEventResult.UserNotFound, null);

            if (user.Role != Role.organizer)
                return (CreateEventResult.NotAnOrganizer, null);

            var evt = new Event
            {
                Title = request.Title,
                Description = request.Description,
                Date = request.Date,
                Address = request.Address,
                Location = request.Location,
                Category = request.Category?.ToString(),
                BannerBase64 = request.BannerBase64,
                Capacity = request.Capacity,
                OrganizerId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (request.Latitude.HasValue && request.Longitude.HasValue)
            {
                evt.GeoLocation = new GeoLocation
                {
                    Type = "Point",
                    Coordinates = [request.Longitude.Value, request.Latitude.Value]
                };
            }

            var created = await _eventRepo.CreateAsync(evt);
            return (CreateEventResult.Success, created);
        }

        public async Task<IEnumerable<EventFeedResponse>> GetMyEventsAsync(string organizerId)
        {
            var user = await _userRepo.GetByIdAsync(organizerId);
            if (user == null) return [];

            var events = await _eventRepo.GetByOrganizerIdAsync(user.Id);

            return events.Select(e => new EventFeedResponse
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Date = e.Date,
                Address = e.Address,
                Location = e.Location,
                GeoLocation = e.GeoLocation,
                Category = e.Category,
                BannerBase64 = e.BannerBase64,
                Capacity = e.Capacity,
                ParticipantsCount = e.Participants.Count,
                OrganizerId = e.OrganizerId,
                CreatedAt = e.CreatedAt,
                Status = e.Status ?? "published"
            });
        }

        public async Task<EventFeedResponse?> GetEventByIdAsync(string id)
        {
            var e = await _eventRepo.GetByIdAsync(id);
            if (e == null) return null;

            return new EventFeedResponse
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Date = e.Date,
                Address = e.Address,
                Location = e.Location,
                GeoLocation = e.GeoLocation,
                Category = e.Category,
                BannerBase64 = e.BannerBase64,
                Capacity = e.Capacity,
                ParticipantsCount = e.Participants.Count,
                OrganizerId = e.OrganizerId,
                CreatedAt = e.CreatedAt,
                Status = e.Status
            };
        }

        public async Task<IEnumerable<EventFeedResponse>> GetFeedAsync()
        {
            var events = await _eventRepo.GetFeedAsync(DateTime.UtcNow);

            return events
                .OrderBy(e => e.Date)
                .ThenByDescending(e => e.Participants.Count)
                .Select(e => new EventFeedResponse
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Date = e.Date,
                    Address = e.Address,
                    Location = e.Location,
                    Category = e.Category,
                    BannerBase64 = e.BannerBase64,
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt,
                    Status = e.Status
                });
        }

        public async Task<IEnumerable<EventFeedResponse>> SearchEventsAsync(string? name, string? category)
        {
            var events = await _eventRepo.SearchAsync(name, category);

            return events
                .Select(e => new EventFeedResponse
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Date = e.Date,
                    Address = e.Address,
                    Location = e.Location,
                    Category = e.Category,
                    BannerBase64 = e.BannerBase64,
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt
                });
        }
        public async Task<(EventOperationResult result, Event? evt)> UpdateEventAsync(string organizerId, string eventId, UpdateEventRequest request)
        {
            var user = await _userRepo.GetByIdAsync(organizerId);
            if (user == null)
                return (EventOperationResult.UserNotFound, null);

            var evt = await _eventRepo.GetByIdAsync(eventId);
            if (evt == null)
                return (EventOperationResult.EventNotFound, null);

            if (evt.OrganizerId != user.Id)
                return (EventOperationResult.NotTheOrganizer, null);

            evt.Title = request.Title ?? evt.Title;
            evt.Description = request.Description ?? evt.Description;
            evt.Date = request.Date ?? evt.Date;
            evt.Location = request.Location ?? evt.Location;
            evt.Category = request.Category?.ToString() ?? evt.Category;
            evt.BannerBase64 = request.BannerBase64 ?? evt.BannerBase64;
            evt.Capacity = request.Capacity ?? evt.Capacity;
            evt.Status = request.Status ?? evt.Status;

            if (request.Address != null)
            {
                evt.Address.Street = request.Address.Street ?? evt.Address.Street;
                evt.Address.Number = request.Address.Number ?? evt.Address.Number;
                evt.Address.City = request.Address.City ?? evt.Address.City;
                evt.Address.State = request.Address.State ?? evt.Address.State;
                evt.Address.ZipCode = request.Address.ZipCode ?? evt.Address.ZipCode;
            }

            evt.UpdatedAt = DateTime.UtcNow;

            await _eventRepo.UpdateAsync(eventId, evt);
            return (EventOperationResult.Success, evt);
        }

        public async Task<EventOperationResult> DeleteEventAsync(string organizerId, string eventId)
        {
            var user = await _userRepo.GetByIdAsync(organizerId);
            if (user == null)
                return EventOperationResult.UserNotFound;

            var evt = await _eventRepo.GetByIdAsync(eventId);
            if (evt == null)
                return EventOperationResult.EventNotFound;

            if (evt.OrganizerId != user.Id)
                return EventOperationResult.NotTheOrganizer;

            await _eventRepo.DeleteAsync(eventId);
            return EventOperationResult.Success;



        }
        //configuração dos likes
        public async Task ToggleLikeAsync(string userId, string eventId)
        {
            var existing = await _likeRepository.GetAsync(userId, eventId);

            if (existing != null)
            {
                await _likeRepository.RemoveAsync(existing.Id);
                return;
            }

            var like = new EventLike
            {
                UserId = userId,
                EventId = eventId
            };

            await _likeRepository.AddAsync(like);
        }
        public async Task<int> CountLikesAsync(string eventId)
        {
            return await _likeRepository.CountLikesAsync(eventId);
        }
        public async Task<IEnumerable<EventFeedResponse>> GetNearbyEventsAsync(double longitude, double latitude, double radiusInKm)
        {
            var events = await _eventRepo.GetNearbyAsync(longitude, latitude, radiusInKm);

            return events
                .Select(e => new EventFeedResponse
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Date = e.Date,
                    Address = e.Address,
                    Location = e.Location,
                    Category = e.Category,
                    BannerBase64 = e.BannerBase64,
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt,
                    GeoLocation = e.GeoLocation
                });
        }
        public async Task<IEnumerable<EventFeedResponse>> GetLiked(string userId)
        {
            var events = await _eventRepo.GetLiked(userId);

            return events
                .OrderBy(e => e.Date)
                .ThenByDescending(e => e.Participants.Count)
                .Select(e => new EventFeedResponse
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Date = e.Date,
                    Address = e.Address,
                    Location = e.Location,
                    Category = e.Category,
                    BannerBase64 = e.BannerBase64,
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt,
                    Status = e.Status
                });
        }
    }
}
