﻿using TheLastCandle.Models;
using TheLastCandle.Models.Components;

namespace TheLastCandle.Services.Providers.Interfaces
{
    public interface ISessionProvider
    {
        List<Session> GetAllSessions();
        Session GetSession(Guid guid);
        Session GetSessionForPlayer(Guid guid);
        Session GetSessionForPlayer(Player player);

        Guid AddSession(Session session);
        Guid AddOrUpdate(Session session);
    }
}
