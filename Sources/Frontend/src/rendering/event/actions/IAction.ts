import type { BoardState } from "@/models/BoardState";

export interface IAction{
    validate(state: BoardState): boolean;
    do(state: BoardState): boolean;
}