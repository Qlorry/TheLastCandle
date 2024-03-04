namespace TheLastCandle.Models.Components
{
    public class Passage
    {
        public int rotation { get; set; }
        public List<Direction> connections { get; set; }
        public PassageType type { get; set; }
    }

    public enum Direction
    {
        left,
        right,
        forward,
        back
    }

    public enum PassageType
    {
        T,
        Straight,
        FourWay,
        Corner
    }
}
