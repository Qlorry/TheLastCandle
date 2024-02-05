using TheLastCandle.Models;

namespace TheLastCandle.Services.Interfaces
{
    public interface ISessionProvider
    {
        List<Session> GetAllSessions();
        Session GetSession(Guid guid);
        Session GetSessionForPlayer(Guid guid);
        Session GetSessionForPlayer(Player player);

        void AddSession(Session session);
    }
}
