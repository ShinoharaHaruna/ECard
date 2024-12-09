import { useState, useCallback } from "react";
import { Card as CardComponent } from "./Card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { SiGithub } from "react-icons/si";
import {
    calculateMoneyChange,
    getComputerMove,
    initializeGame,
    createDeck,
    distributeCards,
} from "@/lib/gameLogic";
import { Language, useTranslation, formatMoney } from "@/i18n";
import { GameState, Card as CardType } from "@/types/game";
import { useTheme } from "@/lib/theme-context";

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === "true";

export const GameBoard = () => {
    const [gameState, setGameState] = useState<GameState>(initializeGame());
    const [betInput, setBetInput] = useState("1");
    const [language, setLanguage] = useState<Language>("zh");
    const [betError, setBetError] = useState<string | null>(null);
    const t = useTranslation(language);
    const { theme, toggleTheme } = useTheme();

    const handleBet = useCallback(() => {
        const inputBet = parseInt(betInput) || 0;
        // 验证下注金额
        if (inputBet <= 0) {
            setBetError(t.gameStatus.betErrorMin);
            return;
        }
        if (inputBet > gameState.playerChips) {
            setBetError(t.gameStatus.betErrorMax);
            return;
        }

        // 清除错误并设置下注
        setBetError(null);
        setGameState((prev) => ({
            ...prev,
            currentBet: inputBet,
            gameStatus: "waiting",
        }));
    }, [betInput, gameState.playerChips, t.gameStatus]);

    const handleBetInputChange = useCallback((value: string) => {
        setBetInput(value);
        setBetError(null); // 清除之前的错误
    }, []);

    const handleCardSelect = useCallback(
        (card: CardType) => {
            if (gameState.gameStatus !== "waiting" || card.isPlayed) return;

            // 更新玩家选择的牌和游戏状态为电脑思考中
            setGameState((prev) => {
                const computerMove = getComputerMove(prev.computerCards);

                return {
                    ...prev,
                    playerSelection: card,
                    gameStatus: "computerThinking",
                    playerCards: prev.playerCards.map((c) =>
                        c.id === card.id ? { ...c, isPlayed: true } : c
                    ),
                    _pendingComputerMove: computerMove,
                };
            });

            // 电脑思考 - Random delay between 1-3 seconds
            const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1000-3000ms
            setTimeout(() => {
                setGameState((prev) => {
                    // 如果没有玩家选择或电脑选择，保持当前状态
                    if (!prev.playerSelection || !prev._pendingComputerMove) {
                        console.warn(
                            "Missing player selection or computer move"
                        );
                        return {
                            ...prev,
                            gameStatus: "betting", // Reset to betting if something went wrong
                        };
                    }

                    const computerMove = prev._pendingComputerMove;
                    const { moneyChange, chipsChange } = calculateMoneyChange(
                        prev.playerSelection,
                        computerMove,
                        prev.currentBet
                    );

                    // 更新电脑的选择
                    return {
                        ...prev,
                        gameStatus: "roundEnd",
                        computerSelection: computerMove,
                        computerCards: prev.computerCards.map((c) =>
                            c.id === computerMove.id
                                ? { ...c, isPlayed: true }
                                : c
                        ),
                        playerMoney: prev.playerMoney + moneyChange,
                        playerChips: prev.playerChips + chipsChange,
                        roundWinner:
                            moneyChange > 0
                                ? "player"
                                : chipsChange < 0
                                ? "computer"
                                : "draw",
                    };
                });
            }, randomDelay);
        },
        [gameState.gameStatus]
    );

    const handleDrawContinue = useCallback(() => {
        // 平局时，重置选择状态，但保持已揭示的牌的状态
        setGameState((prev) => ({
            ...prev,
            playerSelection: null,
            computerSelection: null,
            _pendingComputerMove: null,
            gameStatus: "waiting", // 回到等待选牌状态
        }));
    }, []);

    const nextRound = useCallback(() => {
        // 只在没有筹码时结束游戏
        if (gameState.playerChips === 0) {
            setGameState((prev) => ({
                ...prev,
                gameStatus: "gameOver",
            }));
            return;
        }

        // 获取新的牌组
        const deck = createDeck();
        const { playerCards, computerCards, playerHasEmperor } =
            distributeCards(
                deck,
                gameState.lastPlayerHadEmperor // 使用当前局的状态来决定下一局的分配
            );

        setGameState((prev) => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            currentBet: 0,
            playerSelection: null,
            computerSelection: null,
            playerCards,
            computerCards,
            gameStatus: "betting",
            roundWinner: null,
            lastPlayerHadEmperor: playerHasEmperor,
        }));
        setBetInput("1");
    }, [gameState.playerChips, gameState.lastPlayerHadEmperor]);

    const handleRoundEnd = useCallback(() => {
        if (gameState.roundWinner === "draw") {
            handleDrawContinue();
        } else {
            nextRound();
        }
    }, [gameState.roundWinner, nextRound]);

    const resetGame = useCallback(() => {
        setGameState(initializeGame());
        setBetInput("1");
    }, []);

    return (
        <div className="game-board p-4 space-y-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
            <div className="mb-4 flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                    {theme === "light" ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        window.open(
                            "https://github.com/ShinoharaHaruna/ECard",
                            "_blank"
                        )
                    }
                    className="rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                    <SiGithub className="w-5 h-5" />
                </Button>
                <Button
                    variant={language === "zh" ? "default" : "outline"}
                    onClick={() => setLanguage("zh")}
                >
                    中文
                </Button>
                <Button
                    variant={language === "ja" ? "default" : "outline"}
                    onClick={() => setLanguage("ja")}
                >
                    日本語
                </Button>
                <Button
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                >
                    English
                </Button>
            </div>

            <div className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                        <h2 className="text-xl font-semibold">
                            {t.gameStatus.gameTitle}
                        </h2>
                    </div>
                    <div className="text-center">
                        <span className="text-lg font-medium">
                            {t.gameStatus.round} {gameState.currentRound}
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="ml-1 font-bold">
                                {formatMoney(gameState.playerMoney, language)}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold">
                                {t.gameStatus.chips}: {gameState.playerChips}
                            </span>
                        </div>
                    </div>
                </div>

                {gameState.gameStatus === "betting" && (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">
                            {t.gameStatus.betting}
                        </h3>
                        <div className="flex justify-center items-center space-x-2">
                            <input
                                type="number"
                                min="1"
                                max={gameState.playerChips}
                                value={betInput}
                                onChange={(e) =>
                                    handleBetInputChange(e.target.value)
                                }
                                className="w-20 px-2 py-1 border rounded text-center 
                                    text-gray-900 dark:text-gray-100 
                                    bg-white dark:bg-gray-700 
                                    border-gray-300 dark:border-gray-600 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <span className="text-gray-800 dark:text-gray-200">
                                {t.gameStatus.chipsRange}
                            </span>
                        </div>
                        <Button onClick={handleBet}>
                            {t.gameStatus.betButton}
                        </Button>
                        {betError && <p className="text-red-500">{betError}</p>}
                    </div>
                )}

                <div className="flex flex-col gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-center">
                            {t.gameStatus.computerCards}
                        </h3>
                        <div className="flex justify-center space-x-4">
                            {gameState.computerCards.map((card) => (
                                <CardComponent
                                    key={card.id}
                                    card={card}
                                    revealed={DEBUG_MODE || card.isPlayed}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-center">
                            {t.gameStatus.yourCards}
                        </h3>
                        <div className="flex justify-center space-x-4">
                            {gameState.playerCards.map((card) => (
                                <CardComponent
                                    key={card.id}
                                    card={card}
                                    revealed={true}
                                    onClick={() => handleCardSelect(card)}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {gameState.gameStatus === "computerThinking" && (
                    <div className="text-center">
                        <p className="text-xl">{t.gameStatus.thinking}</p>
                    </div>
                )}

                {gameState.gameStatus === "draw" && (
                    <div className="text-center">
                        <p className="text-xl">{t.gameStatus.draw}</p>
                    </div>
                )}

                {gameState.gameStatus === "roundEnd" && (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold">
                            {gameState.roundWinner === "player"
                                ? gameState.playerSelection?.type === "Slave" &&
                                  gameState.computerSelection?.type ===
                                      "Emperor"
                                    ? `${t.gameStatus.slaveWin} ${formatMoney(
                                          gameState.currentBet * 500000,
                                          language
                                      )}!`
                                    : `${t.gameStatus.normalWin} ${formatMoney(
                                          gameState.currentBet * 100000,
                                          language
                                      )}!`
                                : gameState.roundWinner === "draw"
                                ? t.gameStatus.draw
                                : `${t.gameStatus.lose} ${gameState.currentBet} ${t.gameStatus.chipsUnit}!`}
                        </h3>
                        <Button onClick={handleRoundEnd}>
                            {gameState.roundWinner === "draw"
                                ? t.gameStatus.continue
                                : gameState.playerChips === 0
                                ? t.gameStatus.gameOver
                                : t.gameStatus.nextRound}
                        </Button>
                    </div>
                )}

                {gameState.gameStatus === "gameOver" && (
                    <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold">
                            {t.gameStatus.gameOver}
                        </h3>
                        <p className="text-xl">
                            {t.gameStatus.finalResult}:{" "}
                            {formatMoney(gameState.playerMoney, language)}，
                            {t.gameStatus.remainingChips}:{" "}
                            {gameState.playerChips}
                        </p>
                        <Button onClick={resetGame}>
                            {t.gameStatus.playAgain}
                        </Button>
                    </div>
                )}
            </div>

            {DEBUG_MODE && (
                <div className="mt-8 p-4 border border-yellow-500 rounded-lg">
                    <h3 className="text-lg font-bold text-yellow-500 mb-2">
                        Debug Info
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p>Game Status: {gameState.gameStatus}</p>
                        <p>Current Round: {gameState.currentRound}</p>
                        <p>Current Bet: {gameState.currentBet}</p>
                        <p>
                            Computer Cards:{" "}
                            {gameState.computerCards
                                .map((card) => card.type)
                                .join(", ")}
                        </p>
                        <p>
                            Computer Selection:{" "}
                            {gameState.computerSelection?.type || "None"}
                        </p>
                        <p>
                            Player Cards:{" "}
                            {gameState.playerCards
                                .map((card) => card.type)
                                .join(", ")}
                        </p>
                        <p>
                            Player Selection:{" "}
                            {gameState.playerSelection?.type || "None"}
                        </p>
                        <p>
                            Money:{" "}
                            {formatMoney(gameState.playerMoney, language)}
                        </p>
                        <p>Chips: {gameState.playerChips}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
