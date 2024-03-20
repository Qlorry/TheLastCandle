using TheLastCandle.Models;

namespace TheLastCandle.Services.Presenters.Events
{
    // Implement class for each available option. Clients may 
    // - Move
    // - Stay
    // - Fall(select row coll) ?
    // - Place tile
    // - Use Nerve
    // - Pick key
    // - Pass key
    // - Open the Gate
    // - Re light other


    public interface IClientCommand : ICommand
    {
        Guid GetUserId();
        Guid GetSessionGuid();

        // May be approved, and clients will apply server action symetrical to current(should be first, not 100%)
        // Additional events may be triggered
        // Originator will continue as is
        // Others will same play animation
        // May be rejected, we can send only to originator, others do not care.
        List<IServerCommand> Apply(BoardData board, PresenterConfig configurtion);

        bool Validate(BoardData board);
    }
}
