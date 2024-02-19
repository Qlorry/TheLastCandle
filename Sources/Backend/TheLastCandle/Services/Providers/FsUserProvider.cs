using System.Text.Json;
using TheLastCandle.Models;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Providers
{
    public class FsUserProvider : IUserProvider
    {
        private readonly string _sessionsFile = "storage/user_storage.json";
        private List<Player> _users = new List<Player>();

        private void Update()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Updating Player list");
                using (FileStream fileStream = new FileStream(_sessionsFile, new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    _users = JsonSerializer.Deserialize<List<Player>>(fileStream);
                }
            }
            catch (JsonException ex)
            {
                System.Diagnostics.Trace.TraceError("Could not deserialize " + _sessionsFile + ". Error: " + ex.Message);
                Write();
            }
            catch (Exception ex) when (ex is FileNotFoundException || ex is IOException || ex is DirectoryNotFoundException)
            {
                System.Diagnostics.Trace.TraceError("Could not find file " + _sessionsFile + ". Error: " + ex.Message);
                Write();
            }
        }
        private void Write()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Saving sessions list");
                using (FileStream fileStream = new FileStream(_sessionsFile, new FileStreamOptions { Mode = FileMode.OpenOrCreate, Access = FileAccess.Write }))
                {
                    var str = JsonSerializer.Serialize(_users).ToString();
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.Write(str);
                    writer.Close();
                }
            }
            catch (Exception ex) when (ex is FileNotFoundException || ex is IOException || ex is DirectoryNotFoundException)
            {
                System.Diagnostics.Trace.TraceError("Could not write to file " + _sessionsFile + ". Error: " + ex.Message);
                throw;
            }
        }

        public List<Player> GetAllUsers()
        {
            Update();
            return _users;
        }

        public Player GetUser(Guid guid)
        {
            Update();
            var pl = _users.Find(obj => obj.Id == guid);
            return (pl ?? throw new KeyNotFoundException()).Copy();
        }

        public IEnumerable<Player> GetUsers(IEnumerable<Guid> userGuids)
        {
            Update();
            List<Player> users = new List<Player>();
            foreach (var userGuid in userGuids)
            {
                var pl = _users.Find(obj => obj.Id == userGuid);
                users.Add((pl ?? throw new KeyNotFoundException()).Copy());
            }
            return users;
        }

        public Guid AddUser(Player newUser)
        {
            try
            {
                var _ = GetUser(newUser.Email);
                throw new IUserProvider.AlreadyExistsException("User already exists!");
            }
            catch (KeyNotFoundException) { }

            newUser.Id = Guid.NewGuid();
            _users.Add(newUser);
            Write();
            return newUser.Id;
        }

        public Player GetUser(string userEmail)
        {
            Update();
            var pl = _users.Find(obj => string.Equals(obj.Email, userEmail, StringComparison.InvariantCultureIgnoreCase));
            return (pl ?? throw new KeyNotFoundException()).Copy();
        }
    }
}
