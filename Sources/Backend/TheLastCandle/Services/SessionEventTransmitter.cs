using Microsoft.AspNetCore.SignalR;
using TheLastCandle.Hubs;
using TheLastCandle.Services.Presenters.Command.Server;
using TheLastCandle.Services.Presenters.Events;
using TheLastCandle.Services.Presenters.Events.Server;

namespace TheLastCandle.Services
{
    public class SessionEventTransmitter : IServerEventTransmitter
    {
        private readonly IHubContext<GameHub, IGameClient> _hubContext;
        private readonly ILogger<SessionEventTransmitter> _logger;
        private Task _backgroundTask;
        private CancellationTokenSource _cancellationToken = new CancellationTokenSource();
        public SessionEventTransmitter(IHubContext<GameHub, IGameClient> hubContext, ILogger<SessionEventTransmitter> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }
        private TransmitterContext _ctx;

        public void SetContext(TransmitterContext ctx)
        {
            _ctx = ctx;
        }
        public void Run()
        {
            var tocken = _cancellationToken.Token;
            _backgroundTask = new Task(async () =>
            {
                while (!tocken.IsCancellationRequested || await _ctx.reader.WaitToReadAsync())
                {
                    try
                    {
                        var message = await _ctx.reader.ReadAsync();

                        await Send(message);
                    }
                    catch
                    {
                    }
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

        private async Task Send(IServerCommand e)
        {
            // May modify sending strategy based on server event type
            // For now multicast to all users
            //await _hubContext.Clients.Group(_ctx.sessionId.ToString()).ServerMessage(e);

            var recepients = _hubContext.Clients.Group(_ctx.sessionId.ToString());

            var type = e.GetType();
            if (type == typeof(BoardUpdate))
            {
                await recepients.BoardUpdate(((BoardUpdate)e).GetData(), e.GetStatus());
            }
            else if (type == typeof(SPlayerMove))
            {
                await recepients.PlayerMove(((SPlayerMove)e).GetData(), e.GetStatus());
            }
            else if (type == typeof(Reject))
            {
                await recepients.Reject(((Reject)e).GetData(), e.GetStatus());
            }
            else
            {
                _logger.LogError($"Could not send event because no logic were provided! ({e.GetType().Name})");
            }
        }
    }
}
