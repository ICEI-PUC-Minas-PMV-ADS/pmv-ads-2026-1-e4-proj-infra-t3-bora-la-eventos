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
        public int Capacity { get; set; }
    }
}
