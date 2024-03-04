using TheLastCandle.Models;

namespace TheLastCandle.Services.Providers.Interfaces
{
    public interface IBoardProvider
    {
        BoardData GetBoard(Guid sessionId);
        void AddOrUpdate(BoardData board);
    }
}
