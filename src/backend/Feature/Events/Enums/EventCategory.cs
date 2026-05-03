using System.Text.Json.Serialization;

namespace BoraLaBackend.Feature.Events.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EventCategory
    {
        Musica,
        Esporte,
        Arte,
        Gastronomia,
        Tecnologia,
        Negocios,
        Festas,
        Outro
    }
}
