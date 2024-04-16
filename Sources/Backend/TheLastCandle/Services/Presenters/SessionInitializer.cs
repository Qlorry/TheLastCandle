using TheLastCandle.Models;
using TheLastCandle.Models.Components;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Presenters
{
    public class SessionInitializer
    {
        private readonly IPlayerProvider _playerProvider;
        private readonly IBoardProvider _boardProvider;

        private Session? _currentSession = null;
        public Session CurrentSession { get => _currentSession; set => _currentSession = value; }


        public SessionInitializer(IPlayerProvider playerProvider, IBoardProvider boardProvider)
        {
            _playerProvider = playerProvider;
            _boardProvider = boardProvider;
        }

        public void Initialize(User hostUser)
        {
            var hostPlayer = new Player
            {
                email = hostUser.email,
                name = hostUser.name,
                state = PlayerState.Await
            };
            var hostPlayerId = _playerProvider.AddPlayer(hostPlayer);
            _currentSession.Players.Add(hostPlayerId);

            _currentSession.State = Session.Status.NotStarted;

            var boardState = new BoardData();
            boardState.sessionId = _currentSession.Id;
            {
                boardState.players.Clear();
                boardState.AddPlayer(hostPlayer);

                boardState.nextPassages = GetTiles(_currentSession.setupParams);

                if (_currentSession.setupParams.playerCount == 4)
                {
                    boardState.availableKeys = 6;
                }
            }
            _boardProvider.AddOrUpdate(boardState);
        }

        // one user may control multiple players
        public bool AddPlayerToSession(User user)
        {
            if (_currentSession == null || _currentSession.Players.Count >= 4)
            {
                return false;
            }

            var player = new Player
            {
                email = user.email,
                name = user.name,
                state = PlayerState.Await
            };

            var playerId = _playerProvider.AddPlayer(player);
            _currentSession.Players.Add(playerId);

            return true;
        }

        private List<Passage> GetTiles(SessionSetupParams sessionSetupParams)
        {
            List<Passage> res = new List<Passage>();

            for (int i = 0; i < 8; i++)
            {
                //Keytiles
                res.Add(new Passage { connections = [], rotation = 0, type = PassageType.FourWay });
            }

            for (int i = 0; i < 4; i++)
            {
                //Gates
                res.Add(new Passage { connections = [], rotation = 0, type = PassageType.FourWay });
            }

            if (sessionSetupParams.playerCount == 4)
            {
                for (int i = 0; i < 10 - 2; i++)
                {
                    res.Add(new Passage { connections = [], rotation = 0, type = PassageType.Straight });
                }
                for (int i = 0; i < 32 - 4; i++)
                {
                    res.Add(new Passage { connections = [], rotation = 0, type = PassageType.T });
                }
                for (int i = 0; i < 12 - 2; i++)
                {
                    res.Add(new Passage { connections = [], rotation = 0, type = PassageType.FourWay });
                }
                for (int i = 0; i < 12; i++)
                {
                    // Wax eaters
                    res.Add(new Passage { connections = [], rotation = 0, type = PassageType.FourWay });
                }
            }

            Shuffle(res);

            return res;
        }

        private void Shuffle<T>(IList<T> list)
        {
            Random rng = new Random();

            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }
}
