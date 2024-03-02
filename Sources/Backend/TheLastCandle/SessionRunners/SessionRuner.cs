using System.Threading.Channels;
using TheLastCandle.Services.Presenters;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.SessionRunners
{
    public class SessionRuner : IDisposable
    {
        private Guid _sessionId;
        private readonly ChannelReader<IClientCommand> _reader;
        private readonly ChannelWriter<IServerCommand> _writer;
        private Timer _timer;
        private bool _stop = false;
        private ILogger _logger;
        private ISessionPresenter _gameLogic;

        private object syncObject = new object();
        public SessionRuner(ILogger logger,
            Guid sessionId, ISessionPresenter gamePresenter,
            ChannelReader<IClientCommand> reader, ChannelWriter<IServerCommand> writer)
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
            _timer = new Timer(Tick, null, tickTime, tickTime);
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

                IClientCommand e;
                List<IClientCommand> newEvents = [];
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
