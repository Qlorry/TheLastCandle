using TheLastCandle.Models.Components;
using TheLastCandle.Models.Events;

namespace TheLastCandle.Models.ActionData
{
    public class PlayerUpdateData : IActionData
    {
        public Player player { get; set; }
    }
}
