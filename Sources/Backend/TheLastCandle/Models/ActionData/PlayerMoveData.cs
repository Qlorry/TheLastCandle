using TheLastCandle.Models.Components;

namespace TheLastCandle.Models.Events
{
    namespace Net
    {
        public class PlayerMoveData : IClientActionData
        {
            public GridPosition from { get; set; }
            public GridPosition to { get; set; }
        }
    }
}