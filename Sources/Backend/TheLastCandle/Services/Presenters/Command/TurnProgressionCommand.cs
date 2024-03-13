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

        public List<IServerCommand> Apply(BoardData board, PresenterConfig configurtion)
        {

            if (_afterMove)
            {
                var active = board.GetActivePlayer();
                var update = new PlayerUpdateData();
                board.players[active].state = PlayerState.PlaceTile;
                board.currentGameState = PlayerState.PlaceTile;
                update.player = board.players[active].Copy();

                var next = board.nextPassages[0];
                board.nextPassages.RemoveAt(0);

                if(configurtion.infiniteTiles)
                {
                    board.nextPassages.Add(next);
                }
                board.usedPassages.Add(next);

                // TODO: see if tile can be placed, get correct tile, based on user position, and available space select default position
                var nextTile = new TilePlacementData
                {
                    type = next.type,
                    rotation = next.rotation,
                    to = new Models.Components.GridPosition() { col = 0, row = 0 }
                };
                return [new NextTileSelection(nextTile), new UpdatePlayer(update)];
            }
            if (_afterPlace)
            {
                var changeTurn = new NextTurnCommand();
                return changeTurn.Apply(board);
            }

            return [];
        }

    }
}
