using TheLastCandle.Models.Events;
using TheLastCandle.Services.Providers.Interfaces;

namespace TheLastCandle.Services.Presenters
{
    public class GameBasePresenter : ISessionPresenter
    {
        private readonly ILogger<GameBasePresenter> _logger;
        private readonly ISessionProvider _sessionProvider;
        private readonly IUserProvider _userProvider;

        public GameBasePresenter(ILogger<GameBasePresenter> logger,
            ISessionProvider sessionProvider, IUserProvider userProvider)
        {
            _logger = logger;
            _sessionProvider = sessionProvider;
            _userProvider = userProvider;
        }

        async public IAsyncEnumerable<IServerEvent> ProcessAsync(IEnumerable<IClientEvent> clientEvents)
        {
            yield return null;
        }

        //update session info...
        public void SetContext(Guid sessionId)
        {
            return;
        }
    }
}
