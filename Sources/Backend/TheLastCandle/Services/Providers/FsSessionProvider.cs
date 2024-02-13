using System.Text.Json;
using TheLastCandle.Models;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Providers
{
    public class FsSessionProvider : ISessionProvider
    {
        private const string _sessionsFile = "storage/session_storage.json";
        private List<Session> _sessions = new List<Session>();

        private void Update()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Updating sessions list");
                using (FileStream fileStream = new FileStream(_sessionsFile, new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    _sessions = JsonSerializer.Deserialize<List<Session>>(fileStream);
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
                    var str = JsonSerializer.Serialize(_sessions).ToString();
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

        public Session GetSession(Guid guid)
        {
            Update();
            var sess = _sessions.Find((obj) => obj.Id == guid);
            return sess ?? throw new KeyNotFoundException();
        }

        public Session GetSessionForPlayer(Guid guid)
        {
            Update();
            var sess = _sessions.Find((obj) =>
            {
                return obj.Players.Find((p) => p == guid) != Guid.Empty;
            });

            return sess ?? throw new KeyNotFoundException();
        }

        public Session GetSessionForPlayer(Player player)
        {
            return GetSessionForPlayer(player.Id);
        }

        public List<Session> GetAllSessions()
        {
            Update();
            return _sessions;
        }

        public Guid AddSession(Session session)
        {
            session.Id = Guid.NewGuid();
            _sessions.Add(session);
            Write();
            return session.Id;
        }
    }
}
