using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheLastCandle.Models;
using TheLastCandle.Services.Interfaces;

namespace TheLastCandle.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private readonly IUserProvider _userProvider;

        public UserController(IUserProvider userProvider, ILogger<SessionController> logger)
        {
            _userProvider = userProvider;
            _logger = logger;
        }

        [HttpGet]
        public bool DoesUserExist(string email)
        {
            try
            {
                var user = _userProvider.GetUser(email);
                return true;
            }
            catch (KeyNotFoundException)
            {
                return false;
            }
        }

        [HttpPost]
        public void AddUser(string name, string email)
        {
            _userProvider.AddUser(new Player
            {
                Id = Guid.Empty,
                Name = name,
                Email = email
            });
        }
    }
}
