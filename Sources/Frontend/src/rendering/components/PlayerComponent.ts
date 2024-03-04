export class PlayerComponent {
    public constructor(
        public id: string,
        public name: string,
        public email: string,
        public friends: Array<string>

    ) { }

    public static From(other: PlayerComponent) {
        return new PlayerComponent(
            other.id,
            other.name,
            other.email,
            other.friends ? [...other.friends]: []
        );
    }
}