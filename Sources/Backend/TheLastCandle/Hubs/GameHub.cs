using Microsoft.AspNetCore.SignalR;
using TheLastCandle.Models;
using TheLastCandle.Models.Events;
using TheLastCandle.Models.Events.Net;
using TheLastCandle.Services;
using TheLastCandle.Services.Presenters.Events;
using TheLastCandle.Services.Presenters.Events.Client;

namespace TheLastCandle.Hubs
{
    public interface IGameClient
    {
        Task BoardUpdate(BoardData serverEvent, EventStatus result);
        Task PlayerMove(PlayerMoveData serverEvent, EventStatus result);
    }

    //[Authorize]
    public class GameHub : Hub<IGameClient>
    {
        private readonly SessionManager _sessionManager;
        public GameHub(SessionManager sessionManager)
        {
            _sessionManager = sessionManager;
        }

        public async Task<Guid> ConnectToSession(IClientActionData e)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, e.sessionId.ToString());
            return await ClientMessage(new ClientConnectEvent(e));
        }

        public async Task<Guid> Move(PlayerMoveData move)
        {
            return await ClientMessage(new CPlayerMove(move));
        }

        private async Task<Guid> ClientMessage(IClientCommand clientEvent)
        {
            clientEvent.SetGuid(Guid.NewGuid());
            // Process event: validate, something else?
            ProcessEvent(clientEvent);

            var writer = _sessionManager.GetUpstreamWriter(clientEvent.GetSessionGuid());
            await writer.WriteAsync(clientEvent);
            return clientEvent.GetGuid();
        }

        private void ProcessEvent(IClientCommand clientEvent)
        {

        }
    }
}
