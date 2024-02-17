namespace TheLastCandle.Services.Presenters.Events
{
    public interface IEvent
    {
        Guid GetGuid();
        Guid GetSessionGuid();
    }
}
