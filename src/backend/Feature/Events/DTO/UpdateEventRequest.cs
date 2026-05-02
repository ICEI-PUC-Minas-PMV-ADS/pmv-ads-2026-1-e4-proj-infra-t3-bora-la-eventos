using BoraLaBackend.Feature.Events.Enums;

namespace BoraLaBackend.Feature.Events.DTO
{
    public class UpdateEventRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? Date { get; set; }
        public UpdateAddressRequest? Address { get; set; }
        public string? Location { get; set; }
        public EventCategory? Category { get; set; }
        public int? Capacity { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? BannerBase64 { get; set; }
    }
}
