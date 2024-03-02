using TheLastCandle.Models;
using TheLastCandle.Models.Events.Net;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command.Server
{
    public class SPlayerMove : IServerCommand
    {
        private PlayerMoveData _playerMoveData;
        private EventStatus _eventStatus;

        public SPlayerMove(PlayerMoveData playerMoveData, EventStatus eventStatus)
        {
            _playerMoveData = playerMoveData;
            _eventStatus = eventStatus;
        }

        public bool BoardChanged()
        {
            return true;
        }

        public PlayerMoveData GetData()
        {
            return _playerMoveData;
        }

        public EventStatus GetStatus()
        {
            return _eventStatus;
        }

        public bool ShouldSendOnlyToOriginator()
        {
            return false;
        }

        public bool ShouldSendToAll()
        {
            return true;
        }

        public Guid GetGuid()
        {
            return _playerMoveData.id ?? Guid.Empty;
        }

        public void SetGuid(Guid guid)
        {
            _playerMoveData.id = guid;
        }
    }
}
