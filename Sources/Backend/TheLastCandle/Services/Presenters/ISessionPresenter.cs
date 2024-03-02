using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters
{
    public interface ISessionPresenter
    {
        //May be updated to something more complecated, and request this class once per tick(sounds inefficient)
        void SetContext(Guid sessionId);
        IAsyncEnumerable<IServerCommand> ProcessAsync(IEnumerable<IClientCommand> clientEvents);
    }
}
