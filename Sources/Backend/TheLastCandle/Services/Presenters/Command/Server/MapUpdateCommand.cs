using TheLastCandle.Models;
using TheLastCandle.Models.ActionData;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command.Server
{
    public class MapUpdateCommand : IServerCommand
    {
        MapUpdateData _data;
        public MapUpdateCommand(MapUpdateData data)
        {
            _data = data;
        }
        public bool BoardChanged()
        {
            return true;
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
        public MapUpdateData GetData()
        {
            return _data;
        }
    }
}
