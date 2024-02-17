using TheLastCandle.Models;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Providers
{
    public class FsBoardProvider : IBoardProvider
    {
        public Board GetBoard(Guid sessionId)
        {
            return new Board();
        }

        public void SaveBoard(Guid sessionId, Board board)
        {
            return;
        }
    }
}
