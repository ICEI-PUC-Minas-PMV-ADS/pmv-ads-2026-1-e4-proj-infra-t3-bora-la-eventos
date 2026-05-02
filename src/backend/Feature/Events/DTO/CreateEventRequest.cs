using BoraLaBackend.Feature.Events.Enums;
using BoraLaBackend.Models;

namespace BoraLaBackend.Feature.Events.DTO
{
    public class CreateEventRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public Address Address { get; set; }
        public string Location { get; set; }
        public EventCategory? Category { get; set; }
        public int Capacity { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? BannerBase64 { get; set; }
    }
}
