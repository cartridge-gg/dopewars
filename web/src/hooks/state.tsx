import { create } from "zustand";

export enum Locations {
  Queens = "Queens",
  Bronx = "The Bronx",
  Brooklyn = "Brooklyn",
  Coney = "Coney Island",
  Jersey = "Jersey City",
  Central = "Central Park",
}

export enum Drugs {
  Acid = "Acid",
  Weed = "Weed",
  Ludes = "Ludes",
  Speed = "Speed",
  Heroin = "Heroin",
  Cocaine = "Cocaine",
}

export type DrugsType = {
  [key in Drugs]: {
    quantity: number;
  };
};

export enum TradeDirection {
  Buy,
  Sell,
}

export type Trade = {
  direction: TradeDirection;
  drug: Drugs;
  quantity: number;
  price: number;
};

export type LocationMenu = {
  [key in Drugs]: {
    price: number;
    available: number;
  };
};

export type Inventory = {
    cash: number;
    drugs: DrugsType;
}

export interface GameState {
  // isInitialized: Boolean;
  players: string[];
  inventory: Inventory;
  turns: {
    total: number;
    current: number;
  };
  location: Locations | undefined;
  menu: LocationMenu | undefined;
  pendingTrades: Trade[];
}

const getRandom = (min: number, max: number): number =>
  Math.ceil(Math.random() * max) + min;

const getMenu = (location: Locations): LocationMenu => {
  return {
    [Drugs.Acid]: {
      available: 999999,
      price: getRandom(7, 48),
    },
    [Drugs.Weed]: {
      available: 999999,
      price: getRandom(3, 20),
    },
    [Drugs.Ludes]: {
      available: 999999,
      price: getRandom(1, 6),
    },
    [Drugs.Speed]: {
      available: 999999,
      price: getRandom(5, 35),
    },
    [Drugs.Heroin]: {
      available: 999999,
      price: getRandom(52, 365),
    },
    [Drugs.Cocaine]: {
      available: 999999,
      price: getRandom(38, 285),
    },
  };
};

export const gameStartState = (turns: number, cash: number):GameState => {
  return {
    players: [],
    location: undefined,
    turns: {
      total: turns,
      current: 1,
    },
    inventory: {
      cash: cash,
      drugs: {
        [Drugs.Acid]: { quantity: 0 },
        [Drugs.Weed]: { quantity: 0 },
        [Drugs.Ludes]: { quantity: 0 },
        [Drugs.Speed]: { quantity: 0 },
        [Drugs.Heroin]: { quantity: 0 },
        [Drugs.Cocaine]: { quantity: 0 },
      },
    },
    pendingTrades: [],
    menu: undefined,
  };
};

export const useGameStore = create<GameState>(() => ({
  ...gameStartState(20, 420),
}));

export const updateLocation = (location: Locations) =>
  useGameStore.setState({ location });

export const updateDrug = (drug: Drugs, quantity: number) =>
  useGameStore.setState((state) => ({
    inventory: {
      ...state.inventory,
      drugs: {
        ...state.inventory.drugs,
        [drug]: {
          quantity: state.inventory.drugs[drug].quantity + quantity,
        },
      },
    },
  }));

export const updateCash = (amount: number) =>
  useGameStore.setState((state) => ({
    inventory: { ...state.inventory, cash: state.inventory.cash + amount },
  }));

export const addPlayer = (player: string) =>
  useGameStore.setState((state) => ({ players: [...state.players, player] }));

export const removePlayer = (player: string) =>
  useGameStore.setState((state) => ({
    players: state.players.filter((p) => p !== player),
  }));

export const updateLocationMenu = (menu: LocationMenu) =>
  useGameStore.setState((state) => ({
    menu,
  }));

export const getDrugPrice = (drug: DrugsType): number => {
  const { menu } = useGameStore.getState();
  return menu[drug].price;
};

const addPendingTrade = (
  direction: TradeDirection,
  drug: DrugsType,
  quantity: number,
  price: number,
) => {
  const trade: Trade = {
    direction,
    drug,
    quantity,
    price,
  };

  useGameStore.setState((state) => ({
    pendingTrades: [...state.pendingTrades, trade],
  }));
};

const clearPendingTrades = () => {
  useGameStore.setState((state) => ({
    pendingTrades: [],
  }));
};

export const startGame = () => {
  //set clean state
  useGameStore.setState({
    ...gameStartState(20, 420),
  });
};

export const travelTo = (location: Locations) => {
  // update location
  updateLocation(location);

  // retrieve new location Menu
  updateLocationMenu(getMenu(location));
};

export const endTurn = () => {
  // process trades
  clearPendingTrades();

  // special events

  // update turns
  const { turns } = useGameStore.getState();
  if (turns.current < turns.total) {
    useGameStore.setState((state) => ({
      turns: {
        current: turns.current + 1,
        total: turns.total,
      },
    }));
  } else {
    alert("Game end !");
  }
};

export const trade = (
  direction: TradeDirection,
  drug: DrugsType,
  quantity: number,
) => {
  //retrieve drug price
  const drugPrice = getDrugPrice(drug);

  // add pending trade
  addPendingTrade(direction, drug, quantity, drugPrice);

  // update cash / inventory
  if (direction === TradeDirection.Buy) {
    const totalPrice = drugPrice * quantity;
    updateCash(-totalPrice);
    updateDrug(drug, quantity);
  } else if (direction === TradeDirection.Sell) {
    const totalPrice = drugPrice * quantity;
    updateCash(totalPrice);
    updateDrug(drug, -quantity);
  }
};
