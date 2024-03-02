using TheLastCandle.Models.Components;

namespace TheLastCandle.Services.Providers.Interfaces
{
    public interface IUserProvider
    {
        List<Player> GetAllUsers();
        Player GetUser(Guid guid);
        Player GetUser(string userEmail);
        IEnumerable<Player> GetUsers(IEnumerable<Guid> userGuids);

        Guid AddUser(Player newUser);

        public class AlreadyExistsException : Exception
        {
            public AlreadyExistsException(string what) : base(what) { }
        }
    }
}
