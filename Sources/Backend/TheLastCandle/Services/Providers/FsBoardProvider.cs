using System.Text.Json;
using TheLastCandle.Models;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Providers
{
    public class FsBoardProvider : IBoardProvider
    {

        private const string _boardFile = "storage/board_storage.json";
        private List<BoardData> _boards = new List<BoardData>();

        public BoardData GetBoard(Guid sessionId)
        {
            Update();
            var board = _boards.Find((obj) => obj.sessionId == sessionId);
            return (board ?? throw new KeyNotFoundException()).Copy();
        }

        public void AddOrUpdate(BoardData board)
        {
            Update();
            int had = _boards.RemoveAll(obj => obj.sessionId == board.sessionId);
            _boards.Add(board);
            Write();
        }

        private void Update()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Updating board list");
                using (FileStream fileStream = new FileStream(_boardFile, new FileStreamOptions { Mode = FileMode.Open, Access = FileAccess.Read }))
                {
                    _boards = JsonSerializer.Deserialize<List<BoardData>>(fileStream);
                }
            }
            catch (JsonException ex)
            {
                System.Diagnostics.Trace.TraceError("Could not deserialize " + _boardFile + ". Error: " + ex.Message);
                Write();
            }
            catch (Exception ex) when (ex is FileNotFoundException || ex is IOException || ex is DirectoryNotFoundException)
            {
                System.Diagnostics.Trace.TraceError("Could not find file " + _boardFile + ". Error: " + ex.Message);
                Write();
            }
        }
        private void Write()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Saving sessions list");
                using (FileStream fileStream = new FileStream(_boardFile, new FileStreamOptions { Mode = FileMode.OpenOrCreate, Access = FileAccess.Write }))
                {
                    var str = JsonSerializer.Serialize(_boards).ToString();
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.Write(str);
                    writer.Close();
                }
            }
            catch (Exception ex) when (ex is FileNotFoundException || ex is IOException || ex is DirectoryNotFoundException)
            {
                System.Diagnostics.Trace.TraceError("Could not write to file " + _boardFile + ". Error: " + ex.Message);
                throw;
            }
        }

    }
}
