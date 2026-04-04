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
                    Capacity = e.Capacity,
                    ParticipantsCount = e.Participants.Count,
                    OrganizerId = e.OrganizerId,
                    CreatedAt = e.CreatedAt
                });
        }
    }
}
