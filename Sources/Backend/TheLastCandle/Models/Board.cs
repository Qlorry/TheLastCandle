namespace TheLastCandle.Models
{
    public class Board : ICloneable
    {
        public object Clone()
        {
            return new Board();
        }
    }
}
