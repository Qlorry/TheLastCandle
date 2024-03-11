using TheLastCandle.Models;
using TheLastCandle.Models.ActionData;
using TheLastCandle.Services.Presenters.Command.Server;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command
{
    public class NextTurnCommand : ICommand
    {
        public Guid GetGuid()
        {
            throw new NotImplementedException();
        }

        public void SetGuid(Guid guid)
        {
            throw new NotImplementedException();
        }

        public List<IServerCommand> Apply(BoardData board)
        {
            var activePlayer = board.GetActivePlayer();

            List<IServerCommand> resCommands = new List<IServerCommand>();
            board.players[activePlayer].state = PlayerState.Await;
            resCommands.Add(new UpdatePlayer(
                new PlayerUpdateData { player = board.players[activePlayer] }));

            activePlayer = FindNextPlayer(activePlayer, board);

            board.players[activePlayer].state = PlayerState.Move;
            resCommands.Add(new UpdatePlayer(
                new PlayerUpdateData { player = board.players[activePlayer] }));

            return resCommands;
        }
        Guid FindNextPlayer(Guid active, BoardData board)
        {

            for (var i = 0; i < board.playerOrder.Count - 1; i++)
            {
                if (board.playerOrder[i] == active)
                    return board.playerOrder[i + 1];
            }
            return board.playerOrder[0];
        }
    }

}
