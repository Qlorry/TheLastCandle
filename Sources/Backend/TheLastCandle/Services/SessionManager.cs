using Microsoft.AspNetCore.Mvc;
using System.Threading.Channels;
using TheLastCandle.Models.Events;
using TheLastCandle.Services.Presenters;
using TheLastCandle.Services.SessionRunners;

namespace TheLastCandle.Services
{
    internal struct SessionComposition
    {
        public SessionRuner runner { get; set; }
        public Channel<IClientEvent> upstream { get; set; } // from client 
        public Channel<IServerEvent> downstream { get; set; } // to client
    }
    public class SessionManager : IDisposable
    {
        private readonly ILogger<SessionManager> _logger;
        public SessionManager(ILogger<SessionManager> logger)
        {
            _logger = logger;
        }

        private Dictionary<Guid, SessionComposition> _activeSessions = [];

        public ChannelWriter<IClientEvent> GetUpstreamWriter(Guid sessionId)
        {
            return _activeSessions[sessionId].upstream.Writer;
        }

        public ChannelReader<IServerEvent> GetDownstreamReader(Guid sessionId)
        {
            return _activeSessions[sessionId].downstream.Reader;
        }

        public bool StartSession(Guid sessionId, ISessionPresenter presenter)
        {
            if (_activeSessions.ContainsKey(sessionId))
                return false;

            var upstream = Channel.CreateUnbounded<IClientEvent>();
            var downstream = Channel.CreateUnbounded<IServerEvent>();

            presenter.SetContext(sessionId);

            var comp = new SessionComposition
            {
                runner = new SessionRuner(_logger, sessionId, presenter,
                    upstream.Reader, downstream.Writer),
                upstream = upstream,
                downstream = downstream
            };

            _activeSessions.Add(sessionId, comp);
            comp.runner.Run();
            return true;
        }

        public void StopSession(Guid sessionId)
        {
            _activeSessions[sessionId].downstream.Writer.Complete();
            _activeSessions[sessionId].upstream.Writer.Complete();
            _activeSessions[sessionId].runner.Dispose();
            _activeSessions.Remove(sessionId);
        }

        public void Dispose()
        {
            foreach (var session in _activeSessions)
                session.Value.runner.Dispose();
        }
    }
}
