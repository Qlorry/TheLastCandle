using Microsoft.AspNetCore.Mvc;
using System.Threading.Channels;
using TheLastCandle.Models.Events;
using TheLastCandle.Services.Presenters;
using TheLastCandle.SessionRunners;

namespace TheLastCandle.Services
{
    internal struct SessionComposition
    {
        public SessionRuner runner { get; set; }
        public Channel<IClientEvent> upstream { get; set; } // from client 
        public Channel<IServerEvent> downstream { get; set; } // to client
        public IServerEventTransmitter transmitter { get; set; }
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

        public bool StartSession(Guid sessionId, ISessionPresenter presenter, IServerEventTransmitter transmitter)
        {
            if (_activeSessions.ContainsKey(sessionId))
                return false;

            var upstream = Channel.CreateUnbounded<IClientEvent>();
            var downstream = Channel.CreateUnbounded<IServerEvent>();

            presenter.SetContext(sessionId);
            transmitter.SetContext(new TransmitterContext
            {
                sessionId = sessionId,
                reader = downstream.Reader,
            });

            var composition = new SessionComposition
            {
                runner = new SessionRuner(_logger, sessionId, presenter,
                    upstream.Reader, downstream.Writer),
                upstream = upstream,
                downstream = downstream,
                transmitter = transmitter
            };

            _activeSessions.Add(sessionId, composition);
            composition.runner.Run();
            composition.transmitter.Run();
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
