import type { BoardState } from "@/rendering/util/BoardState";

export interface IAction{
    validate(state: BoardState): boolean;
    do(state: BoardState): boolean;
}