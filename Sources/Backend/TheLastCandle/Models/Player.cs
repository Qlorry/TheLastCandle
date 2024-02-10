namespace TheLastCandle.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public List<string> Friends { get; set; }

    }
}