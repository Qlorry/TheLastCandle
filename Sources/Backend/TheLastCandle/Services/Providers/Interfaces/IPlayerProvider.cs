using TheLastCandle.Models.Components;

namespace TheLastCandle.Services.Providers.Interfaces
{
    public interface IPlayerProvider
    {
        List<Player> GetAllPlayers();
        Player GetPlayer(Guid guid);
        IEnumerable<Player> GetPlayers(IEnumerable<Guid> playerGuids);

        Guid AddPlayer(Player newUser);
    }
}
