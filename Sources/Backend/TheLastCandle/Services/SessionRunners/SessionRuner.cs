using System.Threading.Channels;
using TheLastCandle.Models.Events;
using TheLastCandle.Services.Presenters;

namespace TheLastCandle.Services.SessionRunners
{
    public class SessionRuner : IDisposable
    {
        private Guid _sessionId;
        private readonly ChannelReader<IClientEvent> _reader;
        private readonly ChannelWriter<IServerEvent> _writer;
        private System.Threading.Timer _timer;
        private bool _stop = false;
        private ILogger _logger;
        private ISessionPresenter _gameLogic;

        private object syncObject = new object();
        public SessionRuner(ILogger logger,
            Guid sessionId, ISessionPresenter gamePresenter,
            ChannelReader<IClientEvent> reader, ChannelWriter<IServerEvent> writer)
        {
            _gameLogic = gamePresenter;
            _reader = reader;
            _writer = writer;
            _sessionId = sessionId;
            _logger = logger;
        }

        public void Run(int ticksPerSecond = 2)
        {
            var tickTime = 1000 / ticksPerSecond;
            _timer = new System.Threading.Timer(Tick, null, tickTime, tickTime);
        }

        public void Stop()
        {
            _timer?.Change(Timeout.Infinite, 0);
            Monitor.Enter(syncObject);
            _stop = true;
            Monitor.Exit(syncObject);
        }

        public void Dispose()
        {
            _timer.Dispose();
            Stop();
        }

        private async void Tick(object? state)
        {
            if (!Monitor.TryEnter(syncObject))
            {
                _logger.LogError("Could not process tick: previous is in in progress...");
                return;
            }
            try
            {
                if (_stop)
                    return;

                // Read events
                var tasksToProcess = _reader.Count;
                if (tasksToProcess == 0)
                {
                    return;
                }

                IClientEvent e;
                List<IClientEvent> newEvents = [];
                for (var i = 0; i < tasksToProcess; i++)
                {
                    if (!_reader.TryRead(out e))
                        break;
                    newEvents.Add(e);
                }

                // Do work 
                List<ValueTask> writeTasks = [];
                await foreach (var response in _gameLogic.ProcessAsync(newEvents))
                {
                    // Send right now for faster processing
                    writeTasks.Add(_writer.WriteAsync(response));
                }

                foreach (var write in writeTasks) { await write; }
            }
            finally
            {
                Monitor.Exit(syncObject);
            }
        }
    }
}
