using TheLastCandle.Models;

namespace TheLastCandle.Services.Presenters.Events
{
    public interface IServerCommand : ICommand
    {
        bool ShouldSendToAll();
        bool ShouldSendOnlyToOriginator();
        bool BoardChanged();

        EventStatus GetStatus();
    }
}
