using TheLastCandle.Models;
using TheLastCandle.Models.ActionData;
using TheLastCandle.Services.Presenters.Command.Server;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command
{
    public class TurnProgressionCommand : ICommand
    {
        bool _afterMove = false, _afterPlace = false;
        public TurnProgressionCommand(bool afterMove = false, bool afterPlace = false)
        {
            _afterMove = afterMove; _afterPlace = afterPlace;
        }

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
            var active = board.GetActivePlayer();
            var update = new PlayerUpdateData();

            if (_afterMove)
            {
                board.players[active].state = PlayerState.PlaceTile;
                update.player = board.players[active];
                return [new UpdatePlayer(update)];
            }
            if (_afterPlace)
            {
                var changeTurn = new NextTurnCommand();
                update.player = board.players[active];

                return [new UpdatePlayer(update),
                    .. changeTurn.Apply(board)
                    ];
            }

            return [];
        }

    }
}
