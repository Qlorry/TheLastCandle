﻿namespace TheLastCandle.Models.Components
{
    public class Player : ICopyable<Player>
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public PlayerState state { get; set; }

        public Player Copy()
        {
            return new Player
            {
                id = id,
                name = name,
                email = email,
                state = state
            };
        }
    }
}