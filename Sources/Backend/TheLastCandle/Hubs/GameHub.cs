using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TheLastCandle.Hubs
{
    public interface IGameClient
    {
        Task SendMessage(string aaa);
    }

    [Authorize]
    public class GameHub : Hub<IGameClient>
    {
        public GameHub() { }

        public async Task ConnectToSession(Guid sessionId)
        {

        }
    }
}
