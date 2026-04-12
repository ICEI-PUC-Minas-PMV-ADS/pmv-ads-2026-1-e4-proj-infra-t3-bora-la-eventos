using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.DTO
{
    public class EventFeedResponse
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public Address Address { get; set; }
        public string Location { get; set; }
        public GeoLocation? GeoLocation { get; set; }
        public string Category { get; set; }
        public int Capacity { get; set; }
        public int ParticipantsCount { get; set; }
        public string OrganizerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
