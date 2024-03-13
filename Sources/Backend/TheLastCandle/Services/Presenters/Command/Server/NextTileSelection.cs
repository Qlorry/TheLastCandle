using TheLastCandle.Models;
using TheLastCandle.Models.ActionData;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command.Server
{
    public class NextTileSelection : IServerCommand
    {
        private TilePlacementData _data;

        public NextTileSelection(TilePlacementData data)
        {
            _data = data;
        }

        public bool BoardChanged()
        {
            return false;
        }

        public Guid GetGuid()
        {
            return _data.id ?? Guid.Empty;
        }

        public EventStatus GetStatus()
        {
            return EventStatus.Commited;
        }

        public void SetGuid(Guid guid)
        {
            _data.id = guid;
        }

        public bool ShouldSendOnlyToOriginator()
        {
            return false;
        }

        public bool ShouldSendToAll()
        {
            return true;
        }

        public TilePlacementData GetData()
        {
            return _data;
        }
    }
}
