using TheLastCandle.Models;
using TheLastCandle.Models.ActionData;
using TheLastCandle.Services.Presenters.Command.Server;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services.Presenters.Command.Client
{
    public class CTilePlacement : IClientCommand
    {
        TilePlacementData _data;
        public CTilePlacement(TilePlacementData placementData)
        {
            _data = placementData;
        }

        public List<IServerCommand> Apply(BoardData board, PresenterConfig configurtion)
        {
            board.map[_data.to.row][_data.to.col].passage =
                new Models.Components.Passage()
                {
                    type = _data.type,
                    connections = [],
                    rotation = _data.rotation
                };

            var reaction = new STilePlacement(_data);
            var cmd = new TurnProgressionCommand(false, true);

            return [reaction, .. cmd.Apply(board, configurtion)];
        }

        public Guid GetSessionGuid()
        {
            return _data.sessionId;
        }

        public Guid GetUserId()
        {
            return _data.playerId;
        }

        public bool Validate(BoardData board)
        {
            return true;
        }

        public Guid GetGuid()
        {
            return _data.id ?? Guid.Empty;
        }

        public void SetGuid(Guid guid)
        {
            _data.id = guid;
        }
    }
}
