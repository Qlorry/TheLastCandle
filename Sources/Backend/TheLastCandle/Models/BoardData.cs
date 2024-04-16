using TheLastCandle.Models.Components;
using TheLastCandle.Models.Events;

namespace TheLastCandle.Models
{
    public class BoardCell
    {
        public Passage? passage { get; set; }
        public Guid? player { get; set; }
        public bool hasKey { get; set; }
        //public Monster? monster { get; set; }
    }

    public class BoardData : IActionData, ICopyable<BoardData>
    {
        public List<List<BoardCell>> map { get; set; }
        public Dictionary<Guid, Player> players { get; set; }

        public List<Guid> playerOrder { get; set; }

        public List<Passage> nextPassages { get; set; }
        public List<Passage> usedPassages { get; set; }

        public PlayerState currentGameState { get; set; }

        public int availableKeys { get; set; } = 0;

        public readonly int width = 6;
        public readonly int height = 6;

        public BoardData()
        {
            map = new List<List<BoardCell>>(this.height);
            for (var j = 0; j < this.height; j++)
            {
                map.Add(new List<BoardCell>());
                for (var i = 0; i < this.width; i++)
                {
                    map[j].Add(new BoardCell { });
                }
            }
            players = new Dictionary<Guid, Player>();
            playerOrder = new List<Guid>();
            nextPassages = new List<Passage>();
            usedPassages = new List<Passage>();
            currentGameState = PlayerState.Await;
        }

        public Guid GetActivePlayer()
        {
            Guid activePlayer = playerOrder[0];
            foreach (var pair in players)
            {
                if (pair.Value.state != PlayerState.Await)
                {
                    activePlayer = pair.Key;
                    break;
                }
            }
            return activePlayer;
        }

        public void AddPlayer(Player player)
        {
            playerOrder.Add(player.id);
            players.Add(player.id, player);
        }

        public BoardData Copy()
        {
            BoardData newData = new BoardData();
            newData.map = new List<List<BoardCell>>();
            foreach (var item in map)
            {
                newData.map.Add(new List<BoardCell>());
                foreach (var cell in item)
                {
                    newData.map.Last().Add(cell);
                }
            }

            newData.sessionId = sessionId;
            newData.id = id;
            foreach (var item in players)
            {
                newData.players.Add(item.Key, item.Value.Copy());
            }

            newData.playerOrder = [.. playerOrder];
            newData.usedPassages = [.. usedPassages];
            newData.nextPassages = [.. nextPassages];
            newData.currentGameState = currentGameState;
            newData.availableKeys = availableKeys;
            return newData;
        }
    }
}
