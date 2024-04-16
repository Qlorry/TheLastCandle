using TheLastCandle.Models.Components;

namespace TheLastCandle.Services.Providers.Interfaces
{
    // rewrite for new struct 
    public interface IUserProvider
    {
        List<User> GetAllUsers();
        User GetUser(Guid guid);
        User GetUser(string userEmail);
        IEnumerable<User> GetUsers(IEnumerable<Guid> userGuids);

        Guid AddUser(User newUser);

        public class AlreadyExistsException : Exception
        {
            public AlreadyExistsException(string what) : base(what) { }
        }
    }
}
