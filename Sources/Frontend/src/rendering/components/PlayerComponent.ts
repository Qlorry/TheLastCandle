import type { PlayerState } from "./models/PlayerState";

export class PlayerComponent {
    public constructor(
        public id: string,
        public name: string,
        public email: string,
        public state: PlayerState
    ) { }

    public static From(other: PlayerComponent) {
        return new PlayerComponent(
            other.id,
            other.name,
            other.email,
            other.state
        );
    }
    public Swap(other: PlayerComponent) {
        let temp = PlayerComponent.From(this);

        this.id = other.id;
        this.name = other.name;
        this.email = other.email;
        this.state = other.state;

        other.id = temp.id;
        other.name = temp.name;
        other.email = temp.email;
        other.state = temp.state;
    }
}