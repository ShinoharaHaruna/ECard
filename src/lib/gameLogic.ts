import { Card, GameState } from '@/types/game';

export const TOTAL_ROUNDS = 5;
export const INITIAL_CHIPS = 30;
export const INITIAL_MONEY = 0;
export const NORMAL_MONEY_PER_CHIP = 100000;
export const SLAVE_BONUS_MONEY_PER_CHIP = 500000;

// 从 localStorage 读取游戏状态
export function getGameState(): { lastPlayerHadEmperor: boolean | null, chips: number | null } {
  const lastPlayerHadEmperor = localStorage.getItem('lastPlayerHadEmperor');
  const savedChips = localStorage.getItem('playerChips');
  return {
    lastPlayerHadEmperor: lastPlayerHadEmperor ? JSON.parse(lastPlayerHadEmperor) : null,
    chips: savedChips ? parseInt(savedChips) : null
  };
}

// 保存状态到 localStorage
export function saveGameState(playerHadEmperor: boolean): void {
  localStorage.setItem('lastPlayerHadEmperor', JSON.stringify(playerHadEmperor));
}

// 保存筹码到 localStorage
export function saveChips(chips: number): void {
  localStorage.setItem('playerChips', chips.toString());
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 1;

  // 添加皇帝牌
  deck.push({
    id: id++,
    type: 'Emperor',
    suit: 'Emperor',
    isPlayed: false,
  });

  // 添加市民牌
  for (let i = 0; i < 8; i++) {
    deck.push({
      id: id++,
      type: 'Citizen',
      suit: 'Citizen',
      isPlayed: false,
    });
  }

  // 添加奴隶牌
  deck.push({
    id: id++,
    type: 'Slave',
    suit: 'Slave',
    isPlayed: false,
  });

  return deck;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function distributeCards(deck: Card[], lastPlayerHadEmperor: boolean | null): { playerCards: Card[], computerCards: Card[], playerHasEmperor: boolean } {
  // 首先找到皇帝和奴隶的位置
  const emperorCard = deck.find(card => card.type === 'Emperor');
  const slaveCard = deck.find(card => card.type === 'Slave');
  
  if (!emperorCard || !slaveCard) {
    throw new Error('Deck is missing required cards');
  }
  
  // 从牌组中移除皇帝和奴隶
  const citizenCards = deck.filter(card => card.type === 'Citizen');
  
  // 随机打乱市民牌
  const shuffledCitizens = shuffleArray(citizenCards);
  
  // 决定这一局的分配
  // 如果是首局（lastPlayerHadEmperor 为 null），玩家获得皇帝
  // 否则根据上一局的状态交替分配
  const isEmperorForPlayer = lastPlayerHadEmperor === null ? true : !lastPlayerHadEmperor;
  
  // 分配市民牌
  const playerCitizens = shuffledCitizens.slice(0, 4);
  const computerCitizens = shuffledCitizens.slice(4);
  
  // 根据结果分配皇帝和奴隶
  const playerCards = isEmperorForPlayer 
    ? [...playerCitizens, emperorCard]
    : [...playerCitizens, slaveCard];
    
  const computerCards = isEmperorForPlayer
    ? [...computerCitizens, slaveCard]
    : [...computerCitizens, emperorCard];
  
  return {
    playerCards: shuffleArray(playerCards),
    computerCards: shuffleArray(computerCards),
    playerHasEmperor: isEmperorForPlayer
  };
}

export function initializeGame(): GameState {
  // 重新开始游戏时，清除历史状态
  localStorage.removeItem('lastPlayerHadEmperor');
  
  const deck = createDeck();
  // 首局玩家一定获得皇帝
  const { playerCards, computerCards, playerHasEmperor } = distributeCards(deck, null);

  const savedChips = localStorage.getItem('playerChips');
  const initialChips = savedChips ? parseInt(savedChips) : INITIAL_CHIPS;

  const gameState: GameState = {
    playerCards,
    computerCards,
    playerChips: initialChips,
    playerMoney: INITIAL_MONEY,
    currentBet: 0,
    currentRound: 1,
    playerSelection: null,
    computerSelection: null,
    gameStatus: 'betting',
    roundWinner: null,
    lastPlayerHadEmperor: playerHasEmperor,
    _pendingComputerMove: null
  };

  // 保存初始筹码数
  saveChips(initialChips);
  
  return gameState;
}

export function getComputerMove(computerCards: Card[]): Card {
  const availableCards = computerCards.filter((card) => !card.isPlayed);
  if (availableCards.length === 0) {
    throw new Error('No available cards for computer to play');
  }
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}

export function calculateMoneyChange(
  playerCard: Card,
  computerCard: Card,
  bet: number
): { moneyChange: number, chipsChange: number } {
  // Emperor beats Citizen, Citizen beats Slave, Slave beats Emperor
  if (playerCard.type === computerCard.type) {
    return { moneyChange: 0, chipsChange: 0 };
  }

  if (
    (playerCard.type === 'Emperor' && computerCard.type === 'Citizen') ||
    (playerCard.type === 'Citizen' && computerCard.type === 'Slave')
  ) {
    return { 
      moneyChange: bet * NORMAL_MONEY_PER_CHIP,
      chipsChange: 0
    };
  }

  if (playerCard.type === 'Slave' && computerCard.type === 'Emperor') {
    return { 
      moneyChange: bet * SLAVE_BONUS_MONEY_PER_CHIP,
      chipsChange: 0
    };
  }

  return { 
    moneyChange: 0,
    chipsChange: -bet
  };
}

export function getLastGameState(): boolean | null {
  const saved = localStorage.getItem('lastPlayerHadEmperor');
  return saved ? JSON.parse(saved) : null; // null 表示这是首局游戏
}