//import { ContractCodeView } from "near-api-js/lib/providers/provider";
import { storage, PersistentMap, RNG, logging, context, u128 } from "near-sdk-as"
import { Card, Deck } from "./deck";

export enum GameState {
    Created,
    RedOrBlack,
    HigherOrLower,
    InsideOrOutside,
    WhichSuit,
    Completed
}

@nearBindgen
export class OnNearBus {
    gameId: u32;
    gameState: GameState;
    player: string;
    amount: u128;
    deck: Deck;
    card1: Card;
    card2: Card;
    card3: Card;
    card4: Card;

    constructor() {
        let rng = new RNG<u32>(1, u32.MAX_VALUE);
        let roll = rng.next();
        this.gameId = roll;

        this.gameState = GameState.Created;
        this.player = context.sender;
        this.amount = context.attachedDeposit;

    }
}

export const games = new PersistentMap<String, OnNearBus>("g");