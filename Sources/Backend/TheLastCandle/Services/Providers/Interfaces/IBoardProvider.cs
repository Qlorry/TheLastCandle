using TheLastCandle.Models;

namespace TheLastCandle.Services.Providers.Interfaces
{
    public interface IBoardProvider
    {
        Board GetBoard(Guid sessionId);
        void SaveBoard(Guid sessionId, Board board);
    }
}
