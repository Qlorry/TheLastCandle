using Microsoft.AspNetCore.Mvc;
using TheLastCandle.Models;
using TheLastCandle.Services;
using TheLastCandle.Services.Presenters;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Controllers
{
    // [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private readonly ISessionProvider _sessionProvider;
        private readonly IPlayerProvider _playerProvider;
        private readonly IUserProvider _userProvider;
        private readonly SessionManager _sessionManager;
        public SessionController(ILogger<SessionController> logger,
            ISessionProvider sessionProvider, IUserProvider userProvider, IPlayerProvider playerProvider, SessionManager manager)
        {
            _logger = logger;
            _sessionProvider = sessionProvider;
            _playerProvider = playerProvider;
            _userProvider = userProvider;
            _sessionManager = manager;
        }

        // just for test, remove later
        [HttpGet]
        public IEnumerable<Session> GetAllSessions()
        {
            return _sessionProvider.GetAllSessions();
        }

        [HttpGet]
        public Session GetSession(Guid id)
        {
            return _sessionProvider.GetSession(id);
        }

        [HttpPost]
        public Guid AddSession(string name, string descroption)
        {
            return _sessionProvider.AddSession(new Session
            {
                Id = Guid.Empty,
                Description = name,
                Name = descroption,
                State = Session.Status.NotStarted
            });
        }

        [HttpPost]
        public bool InitializeSession(Guid id, [FromBody] SessionSetupParams sessionSetupParams, [FromServices] IBoardProvider boardProvider)
        {
            var session = _sessionProvider.GetSession(id);
            var hostUser = _userProvider.GetUser("test@gmail.com");
            //User.Claims...

            var initializer = new SessionInitializer(_playerProvider, boardProvider);
            initializer.CurrentSession = session;

            session.setupParams = sessionSetupParams;

            initializer.Initialize(hostUser);

            _sessionProvider.AddOrUpdate(initializer.CurrentSession);

            return true;
        }

        [HttpPost]
        public bool AddPlayerToSession(Guid id, [FromServices] IBoardProvider boardProvider)
        {
            var session = _sessionProvider.GetSession(id);
            var hostUser = _userProvider.GetUser("1test@gmail.com");
            //User.Claims...

            var initializer = new SessionInitializer(_playerProvider, boardProvider);
            initializer.CurrentSession = session;

            var res = initializer.AddPlayerToSession(hostUser);

            _sessionProvider.AddOrUpdate(initializer.CurrentSession);

            return res;
        }

        [HttpGet]
        public bool StartSession(Guid sessionId,
            [FromServices] ISessionPresenter presenter, [FromServices] IServerEventTransmitter transmitter)
        {
            var session = _sessionProvider.GetSession(sessionId);
            if (!_sessionManager.StartSession(sessionId, presenter, transmitter))
            {
                return false;
            }
            session.State = Session.Status.InProgress;
            try
            {
                _sessionProvider.AddOrUpdate(session);
            }
            catch
            {
                _sessionManager.StopSession(sessionId);
                return false;
            }
            return true;
        }

        [HttpGet]
        public bool StopSession(Guid sessionId)
        {
            // Most important is to actually stop it
            try
            {
                _sessionManager.StopSession(sessionId);
            }
            catch { }

            var session = _sessionProvider.GetSession(sessionId);
            session.State = Session.Status.Stopped;
            _sessionProvider.AddOrUpdate(session);

            return true;
        }
    }
}
