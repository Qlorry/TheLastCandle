
using TheLastCandle.Models;

namespace TheLastCandle.Services.Presenters.Events.Server
{
    public class BoardUpdate : IServerCommand
    {
        private readonly BoardData _board;
        public bool _shouldSendOnlyToOriginator = false;
        public bool _shouldSendToAll = true;

        public BoardUpdate(Guid actionId, BoardData board)
        {
            _board = board.Copy();
            SetGuid(actionId);
        }

        public BoardData GetData()
        {
            return _board;
        }

        public bool BoardChanged()
        {
            return true;
        }

        public EventStatus GetStatus()
        {
            return EventStatus.Commited;
        }

        public bool ShouldSendOnlyToOriginator()
        {
            return _shouldSendOnlyToOriginator;
        }

        public bool ShouldSendToAll()
        {
            return _shouldSendToAll;
        }

        public Guid GetGuid()
        {
            return _board.id ?? Guid.Empty;
        }

        public void SetGuid(Guid guid)
        {
            _board.id = guid;
        }
    }
}
