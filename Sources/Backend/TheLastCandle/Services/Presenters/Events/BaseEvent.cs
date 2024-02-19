
namespace TheLastCandle.Services.Presenters.Events
{
    public class BaseEvent(Guid session) : IEvent
    {
        private readonly Guid _guid = Guid.NewGuid();
        private readonly Guid _sessionId = session;

        public Guid GetGuid()
        {
            return _guid;
        }

        public Guid GetSessionGuid()
        {
            return _sessionId;
        }
    }
}
