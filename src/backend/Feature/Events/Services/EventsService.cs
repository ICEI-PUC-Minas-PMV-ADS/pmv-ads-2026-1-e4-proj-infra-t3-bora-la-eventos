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

        public EventsService(IEventRepository eventRepo, IUserRepository userRepo)
        {
            _eventRepo = eventRepo;
            _userRepo = userRepo;
        }

        public async Task<(CreateEventResult result, Event? evt)> CreateEventAsync(string organizerEmail, CreateEventRequest request)
        {
            var user = await _userRepo.GetByEmailAsync(organizerEmail);
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
                Category = request.Category,
                Capacity = request.Capacity,
                OrganizerId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _eventRepo.CreateAsync(evt);
            return (CreateEventResult.Success, created);
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
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt
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
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt
                });
        }
        public async Task<(EventOperationResult result, Event? evt)> UpdateEventAsync(string organizerEmail, string eventId, UpdateEventRequest request)
        {
            var user = await _userRepo.GetByEmailAsync(organizerEmail);
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
            evt.Category = request.Category ?? evt.Category;
            evt.Capacity = request.Capacity ?? evt.Capacity;

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

        public async Task<EventOperationResult> DeleteEventAsync(string organizerEmail, string eventId)
        {
            var user = await _userRepo.GetByEmailAsync(organizerEmail);
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
    }
}
