using TheLastCandle.Models;
using TheLastCandle.Models.Events;
using TheLastCandle.Services.Presenters.Events.Server;

namespace TheLastCandle.Services.Presenters.Events.Client
{
    public class ClientConnectEvent : IClientCommand
    {
        IClientActionData _moveModel;
        public ClientConnectEvent(IClientActionData moveModel)
        {
            _moveModel = moveModel;
        }

        public List<IServerCommand> Apply(BoardData board)
        {
            return new List<IServerCommand> { new BoardUpdate(_moveModel.id ?? Guid.NewGuid(), board) };
        }

        public Guid GetUserId()
        {
            return _moveModel.playerId;
        }

        public Guid GetSessionGuid()
        {
            return _moveModel.sessionId;
        }

        public bool Validate(BoardData board)
        {
            return true;
        }

        public Guid GetGuid()
        {
            return _moveModel.id ?? Guid.Empty;
        }

        public void SetGuid(Guid guid)
        {
            _moveModel.id = guid;
        }
    }
}
