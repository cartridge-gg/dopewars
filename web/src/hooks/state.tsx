import { Account } from "starknet";
import { create } from "zustand";
import { DrugProps, getDrugByName } from "./ui";

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

export enum TravelEvents {
  Mugged = "Mugged",
  Rugged = "Rugged",
  Arrested = "Arrested",
  None = "",
}

export enum TradeDirection {
  Buy,
  Sell,
}

export type TradeType = {
  quantity: number;
  direction: TradeDirection;
};

export interface PlayerState {
  cash: number;
  inventory: number;
  trades: Map<Drugs, TradeType>;
  addTrade: (drug: Drugs, trade: TradeType) => void;
  clearTrades: () => void;
}

export const usePlayerState = create<PlayerState>((set) => ({
  cash: 0,
  inventory: 0,
  trades: new Map(),
  addTrade: (drug: Drugs, trade: TradeType) =>
    set((state) => {
      const existingTrade = state.trades.get(drug);

      if (!existingTrade) {
        state.trades.set(drug, trade);
        return { trades: new Map(state.trades) };
      }

      let quantity = existingTrade.quantity;
      let direction = existingTrade.direction;

      // if the existing trade has the same direction, add quantities
      if (quantity === trade.direction) {
        quantity += trade.quantity;
      } else {
        // if the existing trade has the opposite direction, subtract quantities
        quantity -= trade.quantity;

        // if negative quantity, reverse the direction and make the quantity positive
        if (quantity < 0) {
          quantity = -quantity;
          direction = trade.direction;
        }

        if (quantity === 0) {
          state.trades.delete(drug);
          return { trades: new Map(state.trades) };
        }
      }

      state.trades.set(drug, { quantity, direction });
      return { trades: new Map(state.trades) };
    }),
  clearTrades: () => set({ trades: new Map() }),
}));

// NOTE: Keeping this for posterity, game state is retrieved from Torii
//       and not kept in the client anymore.

// export type Trade = {
//   direction: TradeDirection;
//   drug: DrugProps;
//   quantity: number;
//   price: number;
// };

// export type LocationMenu = {
//   [key in Drugs]: {
//     price: number;
//     available: number;
//   };
// };

// export type InventoryType = {
//   cash: number;
//   drugs: DrugsType;
//   capacity: number;
// };

// export interface GameState {
//   // isInitialized: Boolean;
//   players: string[];
//   inventory: InventoryType;
//   turns: {
//     total: number;
//     current: number;
//   };
//   location: Locations | undefined;
//   menu: LocationMenu | undefined;
//   trades: Trade[];
//   travelEvent: {
//     event: TravelEvents;
//     description: string;
//   };
// }

// const getRandom = (min: number, max: number): number =>
//   Math.floor(Math.random() * max) + min;

// const getMenu = (location: Locations): LocationMenu => {
//   return {
//     [Drugs.Acid]: {
//       available: 999999,
//       price: getRandom(7, 48),
//     },
//     [Drugs.Weed]: {
//       available: 999999,
//       price: getRandom(3, 20),
//     },
//     [Drugs.Ludes]: {
//       available: 999999,
//       price: getRandom(1, 6),
//     },
//     [Drugs.Speed]: {
//       available: 999999,
//       price: getRandom(5, 35),
//     },
//     [Drugs.Heroin]: {
//       available: 999999,
//       price: getRandom(52, 365),
//     },
//     [Drugs.Cocaine]: {
//       available: 999999,
//       price: getRandom(38, 285),
//     },
//   };
// };

// export const initGameState = (turns: number, cash: number): GameState => {
//   return {
//     players: [],
//     location: undefined,
//     turns: {
//       total: turns,
//       current: 1,
//     },
//     inventory: {
//       cash: cash,
//       drugs: {
//         [Drugs.Acid]: { quantity: 0 },
//         [Drugs.Weed]: { quantity: 0 },
//         [Drugs.Ludes]: { quantity: 0 },
//         [Drugs.Speed]: { quantity: 0 },
//         [Drugs.Heroin]: { quantity: 0 },
//         [Drugs.Cocaine]: { quantity: 0 },
//       },
//       capacity: 100,
//     },
//     trades: [],
//     menu: undefined,
//     travelEvent: {
//       event: TravelEvents.None,
//       description: "",
//     },
//   };
// };

// export const useGameStore = create<GameState>(() => ({
//   ...initGameState(20, 100),
// }));

// export const updateLocation = (location: Locations) =>
//   useGameStore.setState({ location });

// export const updateDrug = (drug: Drugs, quantity: number) =>
//   useGameStore.setState((state) => ({
//     inventory: {
//       ...state.inventory,
//       drugs: {
//         ...state.inventory.drugs,
//         [drug]: {
//           quantity: state.inventory.drugs[drug].quantity + quantity,
//         },
//       },
//     },
//   }));

// export const updateCash = (amount: number) =>
//   useGameStore.setState((state) => ({
//     inventory: { ...state.inventory, cash: state.inventory.cash + amount },
//   }));

// export const addPlayer = (player: string) =>
//   useGameStore.setState((state) => ({ players: [...state.players, player] }));

// export const removePlayer = (player: string) =>
//   useGameStore.setState((state) => ({
//     players: state.players.filter((p) => p !== player),
//   }));

// export const updateLocationMenu = (menu: LocationMenu) =>
//   useGameStore.setState((state) => ({
//     menu,
//   }));

// export const getDrugPrice = (drug: Drugs): number => {
//   const { menu } = useGameStore.getState();
//   return (menu && menu[drug].price) || Number.MAX_VALUE;
// };

// export const getInventoryInfos = () => {
//   const { inventory } = useGameStore.getState();

//   const used = Object.keys(Drugs)
//     .map((d) => inventory.drugs[d as Drugs].quantity)
//     .reduce((prev, curr) => prev + curr, 0);

//   return {
//     used: used,
//     left: inventory.capacity - used,
//     capacity: inventory.capacity,
//   };
// };

// const addPendingTrade = (
//   direction: TradeDirection,
//   drug: Drugs,
//   quantity: number,
//   price: number,
// ) => {
//   const drugConfig = getDrugByName(drug);
//   if (!drugConfig) return;

//   const trade: Trade = {
//     direction,
//     drug: drugConfig,
//     quantity,
//     price,
//   };

//   useGameStore.setState((state) => ({
//     trades: [...state.trades, trade],
//   }));
// };

// const cleartrades = () => {
//   useGameStore.setState((state) => ({
//     trades: [],
//   }));
// };

// const clearTravelEvents = () => {
//   useGameStore.setState((state) => ({
//     travelEvent: {
//       event: TravelEvents.None,
//       description: "",
//     },
//   }));
// };

// const updateTravelEvent = (event: TravelEvents, description: string) =>
//   useGameStore.setState((state) => ({
//     travelEvent: {
//       event,
//       description,
//     },
//   }));

// export const startGame = () => {
//   //set clean state
//   useGameStore.setState({
//     ...initGameState(20, 420),
//   });
// };

// export const travelTo = (location: Locations) => {
//   // clean travel events
//   clearTravelEvents();

//   // update location
//   updateLocation(location);

//   // retrieve new location Menu
//   updateLocationMenu(getMenu(location));
// };

// const getRandomTravelEvent = (): TravelEvents => {
//   const rand = getRandom(0, 100);

//   if (rand < 4) return TravelEvents.Killed;
//   if (rand < 10) return TravelEvents.Mugged;
//   if (rand < 20) return TravelEvents.Rugged;
//   return TravelEvents.None;
// };

// const handleTravelEvent = () => {
//   const event = getRandomTravelEvent();
//   const { cash, drugs } = useGameStore.getState().inventory;

//   if (event === TravelEvents.None) return;

//   if (event === TravelEvents.Killed) {
//     updateCash(-cash);
//     updateDrug(Drugs.Acid, -drugs[Drugs.Acid].quantity);
//     updateDrug(Drugs.Cocaine, -drugs[Drugs.Cocaine].quantity);
//     updateDrug(Drugs.Heroin, -drugs[Drugs.Heroin].quantity);
//     updateDrug(Drugs.Ludes, -drugs[Drugs.Ludes].quantity);
//     updateDrug(Drugs.Speed, -drugs[Drugs.Speed].quantity);
//     updateDrug(Drugs.Weed, -drugs[Drugs.Weed].quantity);

//     updateTravelEvent(event, "You got killed ! R.I.P. ");
//   }

//   if (event === TravelEvents.Rugged) {
//     updateCash(-Math.ceil(cash / 2));

//     updateTravelEvent(event, "You got rugged and lost 50% of your cash");
//   }

//   if (event === TravelEvents.Mugged) {
//     updateDrug(Drugs.Acid, -Math.ceil(drugs[Drugs.Acid].quantity / 2));
//     updateDrug(Drugs.Cocaine, -Math.ceil(drugs[Drugs.Cocaine].quantity / 2));
//     updateDrug(Drugs.Heroin, -Math.ceil(drugs[Drugs.Heroin].quantity / 2));
//     updateDrug(Drugs.Ludes, -Math.ceil(drugs[Drugs.Ludes].quantity / 2));
//     updateDrug(Drugs.Speed, -Math.ceil(drugs[Drugs.Speed].quantity / 2));
//     updateDrug(Drugs.Weed, -Math.ceil(drugs[Drugs.Weed].quantity / 2));

//     updateTravelEvent(event, "You got mugged and lost 50% of your stocks");
//   }
// };

// export const travelAndEndTurn = () => {
//   // special events while traveling
//   handleTravelEvent();
// };

// export const endTurn = () => {
//   // process trades
//   cleartrades();

//   // update turns
//   const { turns } = useGameStore.getState();
//   if (turns.current < turns.total) {
//     useGameStore.setState((state) => ({
//       turns: {
//         current: turns.current + 1,
//         total: turns.total,
//       },
//     }));
//   } else {
//     alert("Game end !");
//   }
// };

// export const trade = (
//   direction: TradeDirection,
//   drug: Drugs,
//   quantity: number,
// ) => {
//   //retrieve drug price
//   const drugPrice = getDrugPrice(drug);

//   // add pending trade
//   addPendingTrade(direction, drug, quantity, drugPrice);

//   // update cash / inventory
//   if (direction === TradeDirection.Buy) {
//     const totalPrice = drugPrice * quantity;
//     updateCash(-totalPrice);
//     updateDrug(drug, quantity);
//   } else if (direction === TradeDirection.Sell) {
//     const totalPrice = drugPrice * quantity;
//     updateCash(totalPrice);
//     updateDrug(drug, -quantity);
//   }
// };
