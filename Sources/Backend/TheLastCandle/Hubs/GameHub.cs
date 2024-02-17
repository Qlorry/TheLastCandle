using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TheLastCandle.Services;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Hubs
{
    public interface IGameClient
    {
        void ServerMessage(IServerEvent serverEvent);
    }

    [Authorize]
    public class GameHub : Hub<IGameClient>
    {
        private readonly SessionManager _sessionManager;
        public GameHub(SessionManager sessionManager)
        {
            _sessionManager = sessionManager;
        }

        public async Task ClientMessage(Guid sessionId, IClientEvent clientEvent)
        {
            // Process event: validate, something else?
            ProcessEvent(clientEvent);

            var writer = _sessionManager.GetUpstreamWriter(sessionId);
            await writer.WriteAsync(clientEvent);
        }

        private void ProcessEvent(IClientEvent clientEvent)
        {

        }
    }
}
