
using TheLastCandle.Models;

namespace TheLastCandle.Services.Presenters.Events.Server
{
    public class BoardUpdate : BaseEvent, IServerEvent
    {
        private readonly Board _board;
        public BoardUpdate(Guid sessionId, Board board) : base(sessionId)
        {
            _board = (Board)board.Clone();
        }

        public bool BoardChanged()
        {
            return true;
        }

        public IServerEvent.Status GetStatus()
        {
            return IServerEvent.Status.Commited;
        }

        public bool ShouldSendOnlyToOriginator()
        {
            return false;
        }

        public bool ShouldSendToAll()
        {
            return true;
        }
    }
}
