using Microsoft.AspNetCore.SignalR;
using TheLastCandle.Hubs;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services
{
    public class SessionEventTransmitter : IServerEventTransmitter
    {
        private readonly IHubContext<GameHub, IGameClient> _hubContext;
        private Task _backgroundTask;
        private CancellationTokenSource _cancellationToken = new CancellationTokenSource();
        public SessionEventTransmitter(IHubContext<GameHub, IGameClient> hubContext) 
        { 
            _hubContext = hubContext;
        }
        private TransmitterContext _ctx;

        public void SetContext(TransmitterContext ctx)
        {
            _ctx = ctx;
        }
        public void Run()
        {
            var tocken = _cancellationToken.Token;
            _backgroundTask = new Task(async () => {
                while(!tocken.IsCancellationRequested || await _ctx.reader.WaitToReadAsync())
                {
                    var message = await _ctx.reader.ReadAsync();
                    Send(message);
                }
            }, _cancellationToken.Token);

            _backgroundTask.Start();
        }

        // Will stop automatically when reader finished, this is just for manual stops
        public void Stop()
        {
            _cancellationToken.Cancel();
        }

        public bool IsStopped()
        {
            return _backgroundTask.IsCompleted || _backgroundTask.IsCanceled;
        }

        private void Send(IServerEvent e)
        {
            // May modify sending strategy based on server event type
            // For now multicast to all users
            _hubContext.Clients.Group(_ctx.sessionId.ToString()).ServerMessage(e);
        }
    }
}
