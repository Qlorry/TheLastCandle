using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLastCandle.Models;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private readonly ISessionProvider _sessionProvider;
        public SessionController(ISessionProvider sessionProvider, ILogger<SessionController> logger)
        {
            _logger = logger;
            _sessionProvider = sessionProvider;
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
    }
}
