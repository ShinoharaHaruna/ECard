export type CardType = "Emperor" | "Citizen" | "Slave";
export type Suit = CardType; // suit就是牌的类型，表示牌的身份

export type Card = {
    id: number;
    type: CardType;
    suit: Suit;
    isPlayed: boolean;
};

export type GameState = {
    playerCards: Card[];
    computerCards: Card[];
    playerChips: number;
    playerMoney: number;
    currentBet: number;
    currentRound: number;
    playerSelection: Card | null;
    computerSelection: Card | null;
    gameStatus:
        | "betting"
        | "waiting"
        | "computerThinking"
        | "playing"
        | "roundEnd"
        | "gameOver"
        | "draw";
    roundWinner: "player" | "computer" | "draw" | null;
    lastPlayerHadEmperor: boolean;
    _pendingComputerMove: Card | null;
};
