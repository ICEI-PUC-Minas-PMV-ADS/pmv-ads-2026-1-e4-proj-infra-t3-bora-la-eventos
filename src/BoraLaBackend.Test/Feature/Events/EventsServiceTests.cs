using BoraLaBackend.Feature.Events.DTO;
using BoraLaBackend.Feature.Events.Enums;
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

        [Test]
        public async Task GetNearbyEventsAsync_DeveRetornarEventosDentroDoRaio()
        {
            var eventos = new List<Event>
            {
                new Event
                {
                    Id = "1",
                    Title = "Festival na Paulista",
                    Category = "Música",
                    Location = "Club Síntese",
                    GeoLocation = new GeoLocation { Type = "Point", Coordinates = [-46.655881, -23.561414] },
                    Participants = new List<string>()
                }
            };

            _eventRepoMock
                .Setup(r => r.GetNearbyAsync(-46.655881, -23.561414, 10))
                .ReturnsAsync(eventos);

            var resultado = await _service.GetNearbyEventsAsync(-46.655881, -23.561414, 10);

            Assert.That(resultado.Count(), Is.EqualTo(1));
            Assert.That(resultado.First().Title, Is.EqualTo("Festival na Paulista"));
        }

        [Test]
        public async Task GetNearbyEventsAsync_SemEventosNoRaio_DeveRetornarListaVazia()
        {
            _eventRepoMock
                .Setup(r => r.GetNearbyAsync(It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>()))
                .ReturnsAsync(new List<Event>());

            var resultado = await _service.GetNearbyEventsAsync(-43.9387, -19.9167, 10);

            Assert.That(resultado, Is.Empty);
        }

        [Test]
        public async Task GetNearbyEventsAsync_DeveRetornarGeoLocationNaResposta()
        {
            var geoLocation = new GeoLocation { Type = "Point", Coordinates = [-46.655881, -23.561414] };

            _eventRepoMock
                .Setup(r => r.GetNearbyAsync(-46.655881, -23.561414, 10))
                .ReturnsAsync(new List<Event>
                {
                    new Event
                    {
                        Id = "1",
                        Title = "Evento com Coordenadas",
                        GeoLocation = geoLocation,
                        Participants = new List<string>()
                    }
                });

            var resultado = await _service.GetNearbyEventsAsync(-46.655881, -23.561414, 10);

            Assert.That(resultado.First().GeoLocation, Is.Not.Null);
            Assert.That(resultado.First().GeoLocation!.Type, Is.EqualTo("Point"));
            Assert.That(resultado.First().GeoLocation!.Coordinates, Is.EqualTo(new double[] { -46.655881, -23.561414 }));
        }

        [Test]
        public async Task GetNearbyEventsAsync_DeveRetornarMultiplosEventosDentroDoRaio()
        {
            var eventos = new List<Event>
            {
                new Event { Id = "1", Title = "Evento A", GeoLocation = new GeoLocation { Type = "Point", Coordinates = [-46.65, -23.56] }, Participants = new List<string>() },
                new Event { Id = "2", Title = "Evento B", GeoLocation = new GeoLocation { Type = "Point", Coordinates = [-46.66, -23.57] }, Participants = new List<string>() },
                new Event { Id = "3", Title = "Evento C", GeoLocation = new GeoLocation { Type = "Point", Coordinates = [-46.67, -23.58] }, Participants = new List<string>() }
            };

            _eventRepoMock
                .Setup(r => r.GetNearbyAsync(-46.655881, -23.561414, 50))
                .ReturnsAsync(eventos);

            var resultado = await _service.GetNearbyEventsAsync(-46.655881, -23.561414, 50);

            Assert.That(resultado.Count(), Is.EqualTo(3));
        }

        // ── CreateEventAsync ──────────────────────────────────────────────────

        [Test]
        public async Task CreateEventAsync_DeveRetornarSuccess_QuandoOrganizadorValido()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.CreateAsync(It.IsAny<Event>())).ReturnsAsync((Event e) => e);

            var request = new CreateEventRequest
            {
                Title = "Show", Description = "Desc", Date = DateTime.UtcNow.AddDays(5),
                Address = new Address { Street = "Rua A", Number = "1", City = "BH", State = "MG", ZipCode = "30000-000" },
                Location = "BH", Capacity = 100
            };

            var (result, evt) = await _service.CreateEventAsync("org@teste.com", request);

            Assert.That(result, Is.EqualTo(CreateEventResult.Success));
            Assert.That(evt, Is.Not.Null);
        }

        [Test]
        public async Task CreateEventAsync_DeveDefinirOrganizerId_ComIdDoUsuario()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.CreateAsync(It.IsAny<Event>())).ReturnsAsync((Event e) => e);

            var request = new CreateEventRequest
            {
                Title = "Show", Description = "Desc", Date = DateTime.UtcNow.AddDays(5),
                Address = new Address { Street = "Rua A", Number = "1", City = "BH", State = "MG", ZipCode = "30000-000" },
                Location = "BH", Capacity = 100
            };

            var (_, evt) = await _service.CreateEventAsync("org@teste.com", request);

            Assert.That(evt!.OrganizerId, Is.EqualTo("org1"));
        }

        [Test]
        public async Task CreateEventAsync_DeveRetornarUserNotFound_QuandoUsuarioNaoExiste()
        {
            _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

            var (result, evt) = await _service.CreateEventAsync("naoexiste@teste.com", new CreateEventRequest());

            Assert.That(result, Is.EqualTo(CreateEventResult.UserNotFound));
            Assert.That(evt, Is.Null);
        }

        [Test]
        public async Task CreateEventAsync_DeveRetornarNotAnOrganizer_QuandoUsuarioComum()
        {
            var user = new User { Id = "u1", Email = "user@teste.com", Role = Role.user };
            _userRepoMock.Setup(r => r.GetByEmailAsync("user@teste.com")).ReturnsAsync(user);

            var (result, evt) = await _service.CreateEventAsync("user@teste.com", new CreateEventRequest());

            Assert.That(result, Is.EqualTo(CreateEventResult.NotAnOrganizer));
            Assert.That(evt, Is.Null);
        }

        [Test]
        public async Task CreateEventAsync_DeveDefinirGeoLocation_QuandoCoordenadasFornecidas()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.CreateAsync(It.IsAny<Event>())).ReturnsAsync((Event e) => e);

            var request = new CreateEventRequest
            {
                Title = "Show", Description = "Desc", Date = DateTime.UtcNow.AddDays(5),
                Address = new Address { Street = "Rua A", Number = "1", City = "BH", State = "MG", ZipCode = "30000-000" },
                Location = "BH", Capacity = 100, Latitude = -23.56, Longitude = -46.65
            };

            var (_, evt) = await _service.CreateEventAsync("org@teste.com", request);

            Assert.That(evt!.GeoLocation, Is.Not.Null);
            Assert.That(evt.GeoLocation!.Coordinates, Is.EqualTo(new double[] { -46.65, -23.56 }));
        }

        [Test]
        public async Task CreateEventAsync_GeoLocationDeveSerNulo_QuandoSemCoordenadas()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.CreateAsync(It.IsAny<Event>())).ReturnsAsync((Event e) => e);

            var request = new CreateEventRequest
            {
                Title = "Show", Description = "Desc", Date = DateTime.UtcNow.AddDays(5),
                Address = new Address { Street = "Rua A", Number = "1", City = "BH", State = "MG", ZipCode = "30000-000" },
                Location = "BH", Capacity = 100
            };

            var (_, evt) = await _service.CreateEventAsync("org@teste.com", request);

            Assert.That(evt!.GeoLocation, Is.Null);
        }

        // ── UpdateEventAsync ──────────────────────────────────────────────────

        [Test]
        public async Task UpdateEventAsync_DeveRetornarSuccess_QuandoOrganizadorEDono()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Title = "Antigo", Description = "Desc", Location = "BH", Capacity = 50, Date = DateTime.UtcNow.AddDays(5), Address = new Address(), Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);
            _eventRepoMock.Setup(r => r.UpdateAsync("evt1", It.IsAny<Event>())).Returns(Task.CompletedTask);

            var (result, evt) = await _service.UpdateEventAsync("org@teste.com", "evt1", new UpdateEventRequest { Title = "Novo" });

            Assert.That(result, Is.EqualTo(EventOperationResult.Success));
            Assert.That(evt!.Title, Is.EqualTo("Novo"));
        }

        [Test]
        public async Task UpdateEventAsync_DeveAtualizarApenasCamposEnviados()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Title = "Título Original", Description = "Descrição Original", Location = "Local Original", Capacity = 50, Date = DateTime.UtcNow.AddDays(5), Address = new Address(), Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);
            _eventRepoMock.Setup(r => r.UpdateAsync("evt1", It.IsAny<Event>())).Returns(Task.CompletedTask);

            var (_, evt) = await _service.UpdateEventAsync("org@teste.com", "evt1", new UpdateEventRequest { Title = "Título Novo" });

            Assert.That(evt!.Title, Is.EqualTo("Título Novo"));
            Assert.That(evt.Description, Is.EqualTo("Descrição Original"));
            Assert.That(evt.Location, Is.EqualTo("Local Original"));
        }

        [Test]
        public async Task UpdateEventAsync_DeveAtualizarEnderecoParcialmente()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            var evento = new Event
            {
                Id = "evt1", OrganizerId = "org1", Title = "Show", Description = "Desc", Location = "BH", Capacity = 50,
                Date = DateTime.UtcNow.AddDays(5), Participants = new List<string>(),
                Address = new Address { Street = "Rua A", Number = "1", City = "BH", State = "MG", ZipCode = "30000-000" }
            };

            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);
            _eventRepoMock.Setup(r => r.UpdateAsync("evt1", It.IsAny<Event>())).Returns(Task.CompletedTask);

            var (_, evt) = await _service.UpdateEventAsync("org@teste.com", "evt1", new UpdateEventRequest
            {
                Address = new UpdateAddressRequest { City = "São Paulo" }
            });

            Assert.That(evt!.Address.City, Is.EqualTo("São Paulo"));
            Assert.That(evt.Address.Street, Is.EqualTo("Rua A"));
            Assert.That(evt.Address.State, Is.EqualTo("MG"));
        }

        [Test]
        public async Task UpdateEventAsync_DeveRetornarUserNotFound_QuandoUsuarioNaoExiste()
        {
            _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

            var (result, evt) = await _service.UpdateEventAsync("naoexiste@teste.com", "evt1", new UpdateEventRequest());

            Assert.That(result, Is.EqualTo(EventOperationResult.UserNotFound));
            Assert.That(evt, Is.Null);
        }

        [Test]
        public async Task UpdateEventAsync_DeveRetornarEventNotFound_QuandoEventoNaoExiste()
        {
            var user = new User { Id = "org1", Email = "org@teste.com", Role = Role.organizer };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<string>())).ReturnsAsync((Event?)null);

            var (result, evt) = await _service.UpdateEventAsync("org@teste.com", "inexistente", new UpdateEventRequest());

            Assert.That(result, Is.EqualTo(EventOperationResult.EventNotFound));
            Assert.That(evt, Is.Null);
        }

        [Test]
        public async Task UpdateEventAsync_DeveRetornarNotTheOrganizer_QuandoNaoEDono()
        {
            var user = new User { Id = "org2", Email = "outro@teste.com", Role = Role.organizer };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("outro@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);

            var (result, evt) = await _service.UpdateEventAsync("outro@teste.com", "evt1", new UpdateEventRequest());

            Assert.That(result, Is.EqualTo(EventOperationResult.NotTheOrganizer));
            Assert.That(evt, Is.Null);
        }

        // ── DeleteEventAsync ──────────────────────────────────────────────────

        [Test]
        public async Task DeleteEventAsync_DeveRetornarSuccess_QuandoOrganizadorEDono()
        {
            var user = new User { Id = "org1", Email = "org@teste.com" };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);
            _eventRepoMock.Setup(r => r.DeleteAsync("evt1")).Returns(Task.CompletedTask);

            var result = await _service.DeleteEventAsync("org@teste.com", "evt1");

            Assert.That(result, Is.EqualTo(EventOperationResult.Success));
        }

        [Test]
        public async Task DeleteEventAsync_DeveChamarDeleteNoRepository()
        {
            var user = new User { Id = "org1", Email = "org@teste.com" };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);
            _eventRepoMock.Setup(r => r.DeleteAsync("evt1")).Returns(Task.CompletedTask);

            await _service.DeleteEventAsync("org@teste.com", "evt1");

            _eventRepoMock.Verify(r => r.DeleteAsync("evt1"), Times.Once);
        }

        [Test]
        public async Task DeleteEventAsync_DeveRetornarUserNotFound_QuandoUsuarioNaoExiste()
        {
            _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

            var result = await _service.DeleteEventAsync("naoexiste@teste.com", "evt1");

            Assert.That(result, Is.EqualTo(EventOperationResult.UserNotFound));
        }

        [Test]
        public async Task DeleteEventAsync_DeveRetornarEventNotFound_QuandoEventoNaoExiste()
        {
            var user = new User { Id = "org1", Email = "org@teste.com" };
            _userRepoMock.Setup(r => r.GetByEmailAsync("org@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<string>())).ReturnsAsync((Event?)null);

            var result = await _service.DeleteEventAsync("org@teste.com", "inexistente");

            Assert.That(result, Is.EqualTo(EventOperationResult.EventNotFound));
        }

        [Test]
        public async Task DeleteEventAsync_DeveRetornarNotTheOrganizer_QuandoNaoEDono()
        {
            var user = new User { Id = "org2", Email = "outro@teste.com" };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("outro@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);

            var result = await _service.DeleteEventAsync("outro@teste.com", "evt1");

            Assert.That(result, Is.EqualTo(EventOperationResult.NotTheOrganizer));
        }

        [Test]
        public async Task DeleteEventAsync_NaoDeveChamarDelete_QuandoNaoEDono()
        {
            var user = new User { Id = "org2", Email = "outro@teste.com" };
            var evento = new Event { Id = "evt1", OrganizerId = "org1", Participants = new List<string>() };

            _userRepoMock.Setup(r => r.GetByEmailAsync("outro@teste.com")).ReturnsAsync(user);
            _eventRepoMock.Setup(r => r.GetByIdAsync("evt1")).ReturnsAsync(evento);

            await _service.DeleteEventAsync("outro@teste.com", "evt1");

            _eventRepoMock.Verify(r => r.DeleteAsync(It.IsAny<string>()), Times.Never);
        }
    }
}
