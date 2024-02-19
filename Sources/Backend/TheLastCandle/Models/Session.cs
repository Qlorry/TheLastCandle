namespace TheLastCandle.Models
{
    public class Session
    {
        public enum Status
        {
            NotStarted,
            InProgress,
            Stopped,
            Finished
        };

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Guid> Players { get; set; } = [];
        public Status State { get; set; }

        public Session Copy()
        {
            return new Session
            {
                Id = this.Id,
                Name = this.Name,
                Description = this.Description,
                State = this.State,
                Players = this.Players == null ? [] : [.. this.Players]
            };
        }
    }
}
