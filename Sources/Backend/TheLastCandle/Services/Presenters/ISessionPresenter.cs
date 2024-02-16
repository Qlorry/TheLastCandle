using System.Diagnostics;
using TheLastCandle.Models.Events;

namespace TheLastCandle.Services.Presenters
{
    public interface ISessionPresenter
    {
        //May be updated to something more complecated, and request this class once per tick(sounds inefficient)
        void SetContext(Guid sessionId);
        IAsyncEnumerable<IServerEvent> ProcessAsync(IEnumerable<IClientEvent> clientEvents);
    }
}
