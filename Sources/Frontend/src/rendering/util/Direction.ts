import { Direction } from "@/rendering/components/models/Direction";

function getOpositDirection(dir: Direction)
{
    switch(dir)
    {
        case Direction.left:
            return Direction.right;
        case Direction.right:
            return Direction.left;
        case Direction.forward:
            return Direction.back;
        case Direction.back:
            return Direction.forward;
    }
}

export {
    getOpositDirection
}