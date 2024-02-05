using Microsoft.AspNetCore.Mvc;
using TheLastCandle.Models;
using TheLastCandle.Services.Interfaces;

namespace TheLastCandle.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ISessionProvider _sessionProvider;
        public SessionController(ISessionProvider sessionProvider)
        {
            _sessionProvider = sessionProvider;
        }

        // just for test, remove later
        [HttpGet(Name = "GetAllSessions")]
        public IEnumerable<Session> GetAllSessions()
        {
            return _sessionProvider.GetAllSessions();
        }

        // just for test, remove later
        [HttpPost(Name = "AddSession")]
        public void AddSession()
        {
            _sessionProvider.AddSession(new Session
            {
                Id = Guid.NewGuid(),
                Description = string.Empty,
                Name = "test",
                State = Session.Status.NotStarted
            });
        }
    }
}
