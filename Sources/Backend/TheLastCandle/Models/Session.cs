namespace TheLastCandle.Models
{
    public class SessionSetupParams
    {
        public int playerCount { get; set; } = 4;
    }

    public class Session : ICopyable<Session>
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
        public Guid BoardId { get; set; }

        public SessionSetupParams setupParams { get; set; } = new SessionSetupParams();

        public Session Copy()
        {
            return new Session
            {
                Id = this.Id,
                Name = this.Name,
                Description = this.Description,
                State = this.State,
                Players = this.Players == null ? [] : [.. this.Players],
                BoardId = this.BoardId,
                setupParams = new SessionSetupParams
                {
                    playerCount = this.setupParams.playerCount
                }
            };
        }
    }
}
