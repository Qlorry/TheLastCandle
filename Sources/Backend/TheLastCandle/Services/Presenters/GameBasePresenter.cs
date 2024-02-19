using TheLastCandle.Models;
using TheLastCandle.Services.Presenters.Events;
using TheLastCandle.Services.Presenters.Events.Server;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Presenters
{
    public class GameBasePresenter : ISessionPresenter
    {
        private readonly ILogger<GameBasePresenter> _logger;
        private readonly ISessionProvider _sessionProvider;
        private readonly IUserProvider _userProvider;
        private readonly IBoardProvider _boardProvider;
        private Guid _sessionId = Guid.Empty;
        private Board _boardState = new Board();

        public GameBasePresenter(ILogger<GameBasePresenter> logger,
            ISessionProvider sessionProvider, IUserProvider userProvider, IBoardProvider boardProvider)
        {
            _logger = logger;
            _sessionProvider = sessionProvider;
            _userProvider = userProvider;
            _boardProvider = boardProvider;
        }

        async public IAsyncEnumerable<IServerEvent> ProcessAsync(IEnumerable<IClientEvent> clientEvents)
        {
            if (_sessionId == Guid.Empty)
                throw new MissingFieldException("session Id was not initialized yet!");

            bool boardChanged = false;
            foreach (var e in clientEvents)
            {
                var results = e.Apply(_boardState);
                foreach (var result in results)
                {
                    boardChanged |= result.BoardChanged();
                    yield return result;
                }
            }

            if (boardChanged)
            {
                yield return new BoardUpdate(_sessionId, _boardState);
                _boardProvider.SaveBoard(_sessionId, _boardState);
            }
        }

        //update session info...
        public void SetContext(Guid sessionId)
        {
            _sessionId = sessionId;
            _boardState = _boardProvider.GetBoard(sessionId);
            return;
        }
    }
}
