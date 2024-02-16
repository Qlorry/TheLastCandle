using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Threading.Channels;
using TheLastCandle.Models.Events;
using TheLastCandle.Services;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Hubs
{
    public interface IGameClient
    {
        Task SendMessage(string aaa);
    }

    [Authorize]
    public class GameHub : Hub<IGameClient>
    {
        private readonly SessionManager _sessionManager;
        public GameHub(SessionManager sessionManager)
        {
            _sessionManager = sessionManager;
        }

        public ChannelReader<IServerEvent> ConnectToSession(Guid sessionId)
        {
            return _sessionManager.GetDownstreamReader(sessionId);
        }

        public async Task DoSomething(Guid sessionId, IClientEvent clientEvent)
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
