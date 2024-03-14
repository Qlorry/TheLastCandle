using TheLastCandle.Models.Events;

namespace TheLastCandle.Models.ActionData
{
    public class MapUpdateData : IActionData
    {
        public List<List<BoardCell>> map;
        public MapUpdateData(BoardData board)
        {
            map = new List<List<BoardCell>>();
            foreach (var row in board.map)
            {
                map.Add(new List<BoardCell>());

                foreach (BoardCell cell in row)
                {
                    map.Last().Add(cell);
                }
            };
        }

    }
}
