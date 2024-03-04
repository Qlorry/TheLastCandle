using TheLastCandle.Models;
using TheLastCandle.Models.Events;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command.Server
{
    public class Reject : IServerCommand
    {
        IActionData data = new IActionData();
        public Reject(Guid guid)
        {
            data.id = guid;
        }

        public IActionData GetData() { return data; }

        public bool BoardChanged()
        {
            return false;
        }

        public Guid GetGuid()
        {
            return data.id ?? Guid.Empty;
        }

        public EventStatus GetStatus()
        {
            return EventStatus.Rejected;
        }

        public void SetGuid(Guid guid)
        {
            data.id = guid;
        }

        public bool ShouldSendOnlyToOriginator()
        {
            return true;
        }

        public bool ShouldSendToAll()
        {
            return false;
        }
    }
}
