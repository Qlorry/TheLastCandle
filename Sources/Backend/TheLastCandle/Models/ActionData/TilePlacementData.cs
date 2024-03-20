using TheLastCandle.Models.Components;
using TheLastCandle.Models.Events;

namespace TheLastCandle.Models.ActionData
{
    public class TilePlacementData : IClientActionData
    {
        public PassageType type { get; set; }
        public GridPosition to { get; set; }
        public int rotation { get; set; }
    }
}
