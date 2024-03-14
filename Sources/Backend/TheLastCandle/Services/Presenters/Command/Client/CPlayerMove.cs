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
            board.map[_data.to.row][_data.to.col].player = _data.playerId;
            RemoveCellsInShadow(board);

            var cmd = new TurnProgressionCommand(true);
            var mapUpdate = new MapUpdateCommand(new Models.ActionData.MapUpdateData(board));

            return [new SPlayerMove(_data, EventStatus.Commited), mapUpdate, .. cmd.Apply(board, configurtion)];
        }

        private void RemoveCellsInShadow(BoardData board)
        {
            int row = _data.from.row - 1 < 0 ? board.height - 1 : _data.from.row - 1;
            int col = _data.from.col;
            if (!HasPlayerNearby(row, col, board))
            {
                board.map[row][col].passage = null;
            }

            row = _data.from.row + 1 >= board.height ? 0 : _data.from.row + 1;
            if (!HasPlayerNearby(row, col, board))
            {
                board.map[row][col].passage = null;
            }

            row = _data.from.row;
            col = _data.from.col - 1 < 0 ? board.width - 1 : _data.from.col - 1;
            if (!HasPlayerNearby(row, col, board))
            {
                board.map[row][col].passage = null;
            }

            col = _data.from.col + 1 >= board.width ? 0 : _data.from.col + 1;
            if (!HasPlayerNearby(row, col, board))
            {
                board.map[row][col].passage = null;
            }
        }

        private bool HasPlayerNearby(int row, int col, BoardData board)
        {
            if (board.map[row][col].player != null)
                return true;
            if (row - 1 >= 0)
            {
                if (board.map[row - 1][col].player != null)
                    return true;
            }
            else
            {
                if (board.map[board.height - 1][col].player != null)
                    return true;
            }

            if (row + 1 < board.height)
            {
                if (board.map[row + 1][col].player != null)
                    return true;
            }
            else
            {
                if (board.map[0][col].player != null)
                    return true;
            }

            if (col - 1 >= 0)
            {
                if (board.map[row][col - 1].player != null)
                    return true;
            }
            else
            {
                if (board.map[row][board.width - 1].player != null)
                    return true;
            }

            if (col + 1 < board.width)
            {
                if (board.map[row][col + 1].player != null)
                    return true;
            }
            else
            {
                if (board.map[row][0].player != null)
                    return true;
            }

            return false;
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
