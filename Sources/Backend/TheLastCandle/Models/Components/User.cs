namespace TheLastCandle.Models.Components
{
    public class User : ICopyable<User>
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        //public List <Guid> players { get; set; }

        public User Copy()
        {
            return new User
            {
                id = id,
                name = name,
                email = email,
            };
        }
    }
}
