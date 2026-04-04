namespace BoraLaBackend.Feature.Events.DTO
{
    public class UpdateEventRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? Date { get; set; }
        public UpdateAddressRequest? Address { get; set; }
        public string? Location { get; set; }
        public int? Capacity { get; set; }
    }
}
