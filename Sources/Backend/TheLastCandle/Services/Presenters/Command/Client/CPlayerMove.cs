using TheLastCandle.Models;
using TheLastCandle.Models.Events.Net;
using TheLastCandle.Services.Presenters.Command;
using TheLastCandle.Services.Presenters.Command.Server;

namespace TheLastCandle.Services.Presenters.Events.Client
{
    public class CPlayerMove : IClientCommand
    {
        PlayerMoveData _data;
        public CPlayerMove(PlayerMoveData moveModel)
        {
            _data = moveModel;
        }

        public List<IServerCommand> Apply(BoardData board, PresenterConfig configurtion)
        {
            board.map[_data.from.row][_data.from.col].player = null;
            board.map[_data.from.row][_data.from.col].passage = null;

            board.map[_data.to.row][_data.to.col].player = _data.playerId;

            var cmd = new TurnProgressionCommand(true);
            var mapUpdate = new MapUpdateCommand(new Models.ActionData.MapUpdateData(board));

            return [new SPlayerMove(_data, EventStatus.Commited), mapUpdate, .. cmd.Apply(board, configurtion)];
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
