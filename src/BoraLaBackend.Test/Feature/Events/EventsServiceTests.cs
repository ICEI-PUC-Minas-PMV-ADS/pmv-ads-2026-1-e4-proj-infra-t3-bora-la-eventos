using BoraLaBackend.Feature.Events.Repository;
using BoraLaBackend.Feature.Events.Services;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Models;
using Moq;

namespace BoraLaBackend.Test.Events
{
    public class EventsServiceTests
    {
        private Mock<IEventRepository> _eventRepoMock;
        private Mock<IUserRepository> _userRepoMock;
        private EventsService _service;

        [SetUp]
        public void Setup()
        {
            _eventRepoMock = new Mock<IEventRepository>();
            _userRepoMock = new Mock<IUserRepository>();
            _service = new EventsService(_eventRepoMock.Object, _userRepoMock.Object);
        }

        [Test]
        public async Task GetFeedAsync_DeveRetornarApenasEventosFuturos()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Evento Futuro", Date = DateTime.UtcNow.AddDays(10), Participants = new List<string>() },
                new Event { Id = "2", Title = "Evento Passado", Date = DateTime.UtcNow.AddDays(-1), Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.GetFeedAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(eventos.Where(e => e.Date >= DateTime.UtcNow).ToList());

            var resultado = await _service.GetFeedAsync();

            Assert.That(resultado.Count(), Is.EqualTo(1));
            Assert.That(resultado.First().Title, Is.EqualTo("Evento Futuro"));
        }

        [Test]
        public async Task GetFeedAsync_DeveOrdenarPorDataCrescente()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Evento Junho", Date = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), Participants = new List<string>() },
                new Event { Id = "2", Title = "Evento Maio", Date = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), Participants = new List<string>() },
                new Event { Id = "3", Title = "Evento Julho", Date = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc), Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.GetFeedAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(eventos);

            var resultado = await _service.GetFeedAsync();
            var lista = resultado.ToList();

            Assert.That(lista[0].Title, Is.EqualTo("Evento Maio"));
            Assert.That(lista[1].Title, Is.EqualTo("Evento Junho"));
            Assert.That(lista[2].Title, Is.EqualTo("Evento Julho"));
        }

        [Test]
        public async Task GetFeedAsync_ComMesmaData_DeveOrdenarPorParticipantesDecrescente()
        {
            var mesmaData = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc);
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Evento Pouco Popular", Date = mesmaData, Participants = new List<string> { "u1" } },
                new Event { Id = "2", Title = "Evento Mais Popular", Date = mesmaData, Participants = new List<string> { "u1", "u2", "u3" } },
                new Event { Id = "3", Title = "Evento Medio", Date = mesmaData, Participants = new List<string> { "u1", "u2" } }
            };

            _eventRepoMock
                .Setup(r => r.GetFeedAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(eventos);

            var resultado = await _service.GetFeedAsync();
            var lista = resultado.ToList();

            Assert.That(lista[0].Title, Is.EqualTo("Evento Mais Popular"));
            Assert.That(lista[1].Title, Is.EqualTo("Evento Medio"));
            Assert.That(lista[2].Title, Is.EqualTo("Evento Pouco Popular"));
        }

        [Test]
        public async Task GetFeedAsync_SemEventosFuturos_DeveRetornarListaVazia()
        {
            _eventRepoMock
                .Setup(r => r.GetFeedAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(new List<Event>());

            var resultado = await _service.GetFeedAsync();

            Assert.That(resultado, Is.Empty);
        }

        [Test]
        public async Task SearchEventsAsync_ComNome_DeveRetornarEventosComNomeCorrespondente()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Festival de Música", Category = "Música", Participants = new List<string>() },
                new Event { Id = "2", Title = "Peça de Teatro", Category = "Teatro", Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.SearchAsync("Festival", null))
                .ReturnsAsync(new List<Event> { eventos[0] });

            var resultado = await _service.SearchEventsAsync("Festival", null);

            Assert.That(resultado.Count(), Is.EqualTo(1));
            Assert.That(resultado.First().Title, Is.EqualTo("Festival de Música"));
        }

        [Test]
        public async Task SearchEventsAsync_ComCategoria_DeveRetornarEventosDaCategoriaCorrespondente()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Festival de Música", Category = "Música", Participants = new List<string>() },
                new Event { Id = "2", Title = "Show de Rock", Category = "Música", Participants = new List<string>() },
                new Event { Id = "3", Title = "Peça de Teatro", Category = "Teatro", Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.SearchAsync(null, "Música"))
                .ReturnsAsync(eventos.Where(e => e.Category == "Música").ToList());

            var resultado = await _service.SearchEventsAsync(null, "Música");

            Assert.That(resultado.Count(), Is.EqualTo(2));
            Assert.That(resultado.All(e => e.Category == "Música"), Is.True);
        }

        [Test]
        public async Task SearchEventsAsync_ComNomeECategoria_DeveRetornarApenasEventosQueCorrespondemAmbos()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Festival de Música Eletrônica", Category = "Música", Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.SearchAsync("Festival", "Música"))
                .ReturnsAsync(eventos);

            var resultado = await _service.SearchEventsAsync("Festival", "Música");

            Assert.That(resultado.Count(), Is.EqualTo(1));
            Assert.That(resultado.First().Title, Is.EqualTo("Festival de Música Eletrônica"));
            Assert.That(resultado.First().Category, Is.EqualTo("Música"));
        }

        [Test]
        public async Task SearchEventsAsync_SemResultados_DeveRetornarListaVazia()
        {
            _eventRepoMock
                .Setup(r => r.SearchAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new List<Event>());

            var resultado = await _service.SearchEventsAsync("EventoInexistente", null);

            Assert.That(resultado, Is.Empty);
        }

        [Test]
        public async Task SearchEventsAsync_ComCategoria_NaoDeveRetornarEventosDeCategoriasDiferentes()
        {
            _eventRepoMock
                .Setup(r => r.SearchAsync(null, "Teatro"))
                .ReturnsAsync(new List<Event>
                {
                    new Event { Id = "1", Title = "Peça de Teatro Clássico", Category = "Teatro", Participants = new List<string>() }
                });

            var resultado = await _service.SearchEventsAsync(null, "Teatro");

            Assert.That(resultado.All(e => e.Category == "Teatro"), Is.True);
            Assert.That(resultado.Any(e => e.Category == "Música"), Is.False);
        }
    }
}
