namespace TheLastCandle.Models
{
    public class Session
    {
        public enum Status
        {
            NotStarted,
            InProgress,
            Finished
        };

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Guid> Players { get; set; }
        public Status State { get; set; }
    }
}
