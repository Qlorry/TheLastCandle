using TheLastCandle.Models;
using TheLastCandle.Models.Components;
using TheLastCandle.Services.Presenters.Command.Server;
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
        private BoardData _boardState = new BoardData();

        public GameBasePresenter(ILogger<GameBasePresenter> logger,
            ISessionProvider sessionProvider, IUserProvider userProvider, IBoardProvider boardProvider)
        {
            _logger = logger;
            _sessionProvider = sessionProvider;
            _userProvider = userProvider;
            _boardProvider = boardProvider;
        }

        async public IAsyncEnumerable<IServerCommand> ProcessAsync(IEnumerable<IClientCommand> clientEvents)
        {
            if (_sessionId == Guid.Empty)
                throw new MissingFieldException("session Id was not initialized yet!");

            bool boardChanged = false;
            foreach (var e in clientEvents)
            {
                List<IServerCommand> results = new List<IServerCommand>();
                try
                {
                    if (e.Validate(_boardState))
                        results = e.Apply(_boardState);
                    else // reject Action
                        results.Add(new Reject(e.GetGuid()));
                }
                catch
                {
                    // add rejection Action
                    results.Add(new Reject(e.GetGuid()));
                }
                foreach (var result in results)
                {
                    boardChanged |= result.BoardChanged();
                    yield return result;
                }
            }

            if (boardChanged)
            {
                yield return new BoardUpdate(_sessionId, _boardState);
                _boardProvider.AddOrUpdate(_boardState);
            }
        }

        //update session info...
        public void SetContext(Guid sessionId)
        {
            _sessionId = sessionId;
            try
            {
                _boardState = _boardProvider.GetBoard(sessionId);

            }
            catch
            {
                _boardState = new BoardData();
                _boardState.sessionId = sessionId;
                {
                    var pl = new Player()
                    {
                        id = Guid.NewGuid(),
                        name = "Test",
                        email = "Test",
                    };
                    _boardState.players.Clear();
                    _boardState.AddPlayer(pl);

                    _boardState.map[0][0].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                    _boardState.map[0][0].player = pl.id;

                    _boardState.map[0][1].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                    _boardState.map[0][2].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                    _boardState.map[0][3].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                    _boardState.map[0][4].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                    _boardState.map[0][5].passage = new Passage()
                    {
                        type = PassageType.FourWay,
                        rotation = 0,
                        connections = new List<Direction> { Direction.left, Direction.right, Direction.forward, Direction.back }
                    };
                }
                _boardProvider.AddOrUpdate(_boardState);
            }
            return;
        }
    }
}
