using System.Text.Json;
using TheLastCandle.Models.Components;
using TheLastCandle.Services.Providers.Interfaces;


namespace TheLastCandle.Services.Providers
{
    public class FsPlayerProvider : IPlayerProvider
    {
        private readonly string _sessionsFile = "storage/player_storage.json";
        private List<Player> _players = new List<Player>();

        private void Update()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Updating Player list");
                using (FileStream fileStream = new FileStream(_sessionsFile, new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    _players = JsonSerializer.Deserialize<List<Player>>(fileStream);
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
                    var str = JsonSerializer.Serialize(_players).ToString();
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

        public List<Player> GetAllPlayers()
        {
            Update();
            return _players;
        }

        public Player GetPlayer(Guid guid)
        {
            Update();
            var pl = _players.Find(obj => obj.id == guid);
            return (pl ?? throw new KeyNotFoundException()).Copy();
        }

        public IEnumerable<Player> GetPlayers(IEnumerable<Guid> playerGuids)
        {
            Update();
            List<Player> players = new List<Player>();
            foreach (var playerGuid in playerGuids)
            {
                var pl = _players.Find(obj => obj.id == playerGuid);
                players.Add((pl ?? throw new KeyNotFoundException()).Copy());
            }
            return players;
        }

        public Guid AddPlayer(Player newPlayer)
        {
            newPlayer.id = Guid.NewGuid();
            _players.Add(newPlayer);
            Write();
            return newPlayer.id;
        }
    }
}
