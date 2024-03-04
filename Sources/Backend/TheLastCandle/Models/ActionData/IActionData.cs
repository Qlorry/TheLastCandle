namespace TheLastCandle.Models.Events
{
    public class IActionData
    {
        public Guid? id { get; set; }
        public Guid sessionId { get; set; }
    }

    public class IClientActionData : IActionData
    {
        public Guid playerId { get; set; }
    }
}
