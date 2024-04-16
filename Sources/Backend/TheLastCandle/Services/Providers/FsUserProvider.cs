﻿using System.Text.Json;
using TheLastCandle.Models.Components;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Providers
{
    public class FsUserProvider : IUserProvider
    {
        private readonly string _sessionsFile = "storage/user_storage.json";
        private List<User> _users = new List<User>();

        private void Update()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Updating User list");
                using (FileStream fileStream = new FileStream(_sessionsFile, new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    _users = JsonSerializer.Deserialize<List<User>>(fileStream);
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

        public List<User> GetAllUsers()
        {
            Update();
            return _users;
        }

        public User GetUser(Guid guid)
        {
            Update();
            var pl = _users.Find(obj => obj.id == guid);
            return (pl ?? throw new KeyNotFoundException()).Copy();
        }

        public IEnumerable<User> GetUsers(IEnumerable<Guid> userGuids)
        {
            Update();
            List<User> users = new List<User>();
            foreach (var userGuid in userGuids)
            {
                var pl = _users.Find(obj => obj.id == userGuid);
                users.Add((pl ?? throw new KeyNotFoundException()).Copy());
            }
            return users;
        }

        public Guid AddUser(User newUser)
        {
            try
            {
                var _ = GetUser(newUser.email);
                throw new IUserProvider.AlreadyExistsException("User already exists!");
            }
            catch (KeyNotFoundException) { }

            newUser.id = Guid.NewGuid();
            _users.Add(newUser);
            Write();
            return newUser.id;
        }

        public User GetUser(string userEmail)
        {
            Update();
            var pl = _users.Find(obj => string.Equals(obj.email, userEmail, StringComparison.InvariantCultureIgnoreCase));
            return (pl ?? throw new KeyNotFoundException()).Copy();
        }
    }
}
