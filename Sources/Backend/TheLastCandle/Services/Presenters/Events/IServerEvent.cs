namespace TheLastCandle.Services.Presenters.Events
{


    public interface IServerEvent : IEvent
    {
        public enum Status
        {
            Commited,
            Rejected
        }

        Status GetStatus();

        bool ShouldSendToAll();
        bool ShouldSendOnlyToOriginator();
        bool BoardChanged();
    }
}
