using Microsoft.AspNetCore.Mvc;
using TheLastCandle.Models.Components;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Controllers
{
    //[Authorize]
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

        [HttpGet]
        public List<User> GetAllUsers()
        {
            return _userProvider.GetAllUsers();
        }

        [HttpPost]
        public void AddUser(string name, string email)
        {
            _userProvider.AddUser(new User
            {
                id = Guid.Empty,
                name = name,
                email = email
            });
        }
    }
}
