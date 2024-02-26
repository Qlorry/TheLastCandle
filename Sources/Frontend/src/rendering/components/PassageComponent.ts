import { Direction } from "@/rendering/util/Direction";
import {PassageType} from '@/models/PassageType'

export class PassageComponent {
    public rotation = 0;
    public connections: Array<Direction>;

    public constructor(public type: PassageType) {
        this.connections = this.getConnections();
    }

    public rotateLeft() {
        this.rotation += 90;
        this.rotation = this.rotation % 360;
        this.connections = this.getConnections();
        return this;
    }

    public rotateRight() {
        this.rotation -= 90;
        this.rotation = this.rotation % 360;
        this.connections = this.getConnections();
        return this;
    }


    private getConnections() {
        let rotationCase = Math.abs(this.rotation);
        switch (this.type) {
            case PassageType.Straight:
                rotationCase = this.rotation % 180;
                break;
            case PassageType.FourWay:
                return [Direction.left, Direction.right, Direction.back, Direction.forward];
            case PassageType.T:
            case PassageType.Corner:
                break;
        }

        switch (this.type) {
            case PassageType.Straight:
                if (rotationCase == 0) {
                    return [Direction.forward, Direction.back]
                }
                else { //90
                    return [Direction.left, Direction.right]
                }
            case PassageType.T:
                if (rotationCase == 0) {
                    return [Direction.left, Direction.right, Direction.back];
                }
                else if (rotationCase == 90) {
                    return [Direction.forward, Direction.right, Direction.back];
                }
                else if (rotationCase == 180) {
                    return [Direction.forward, Direction.right, Direction.left];
                }
                else { // 270
                    return [Direction.forward, Direction.left, Direction.back];
                }
            case PassageType.Corner:
                if (rotationCase == 0) {
                    return [Direction.left, Direction.back];
                }
                else if (rotationCase == 90) {
                    return [Direction.right, Direction.back];
                }
                else if (rotationCase == 180) {
                    return [Direction.forward, Direction.right];
                }
                else { // 270
                    return [Direction.forward, Direction.left];
                }
        }

        return [];
    }
}