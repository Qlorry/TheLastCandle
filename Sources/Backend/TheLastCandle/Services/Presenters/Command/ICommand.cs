namespace TheLastCandle.Services.Presenters.Events
{
    public interface ICommand
    {
        Guid GetGuid();
        void SetGuid(Guid guid);
    }
}
