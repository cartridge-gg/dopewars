import { Encounters, EncounterOutcomes, PlayerStatus } from "@/dojo/types";
import {
  TravelEncounter,
  TravelEncounterResult,
} from "@/components/layout/GlobalEvents";

// Real icon components
import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";
import { Bronx, Brooklyn, Queens, ConeyIsland, CentralPark, Manhattan } from "@/components/icons/locations";
import { Car } from "@/components/icons";
import { Kevlar, Knife, Shoes } from "@/components/icons/items";

// Location configs with real icons
export const mockLocations = [
  { location_id: 1, location: "Queens", name: "Queens", icon: Queens },
  { location_id: 2, location: "Bronx", name: "The Bronx", icon: Bronx },
  { location_id: 3, location: "Brooklyn", name: "Brooklyn", icon: Brooklyn },
  { location_id: 4, location: "Jersey", name: "Jersey City", icon: Manhattan },
  { location_id: 5, location: "Central", name: "Central Park", icon: CentralPark },
  { location_id: 6, location: "Coney", name: "Coney Island", icon: ConeyIsland },
];

// Drug configs with real icons
export const mockDrugs = [
  { drug_id: 0, drug: "Ludes", name: "Ludes", base: 10, step: 2, weight: 1, drugs_mode: "Normal", icon: Ludes },
  { drug_id: 1, drug: "Speed", name: "Speed", base: 20, step: 4, weight: 2, drugs_mode: "Normal", icon: Speed },
  { drug_id: 2, drug: "Weed", name: "Weed", base: 30, step: 5, weight: 3, drugs_mode: "Normal", icon: Weed },
  { drug_id: 3, drug: "Shrooms", name: "Shrooms", base: 40, step: 8, weight: 4, drugs_mode: "Normal", icon: Shrooms },
  { drug_id: 4, drug: "Acid", name: "Acid", base: 50, step: 10, weight: 5, drugs_mode: "Normal", icon: Acid },
  { drug_id: 5, drug: "Ketamine", name: "Ketamine", base: 60, step: 12, weight: 6, drugs_mode: "Normal", icon: Ketamine },
  { drug_id: 6, drug: "Heroin", name: "Heroin", base: 80, step: 15, weight: 8, drugs_mode: "Normal", icon: Heroin },
  { drug_id: 7, drug: "Cocaine", name: "Cocaine", base: 100, step: 20, weight: 10, drugs_mode: "Normal", icon: Cocaine },
];

// Deterministic market prices per location
const marketPrices: Record<string, number[]> = {
  Queens:   [22, 38, 55, 72],
  Bronx:    [18, 44, 48, 80],
  Brooklyn: [26, 32, 62, 68],
  Jersey:   [30, 28, 45, 90],
  Central:  [14, 50, 58, 64],
  Coney:    [20, 36, 52, 76],
};

export const createMockMarketsByLocation = () => {
  const map = new Map<string, { drug: string; drugId: number; price: number; weight: number }[]>();
  for (const loc of mockLocations) {
    const prices = marketPrices[loc.location] || [25, 40, 55, 70];
    map.set(
      loc.location,
      mockDrugs.slice(0, 4).map((d, i) => ({
        drug: d.drug,
        drugId: d.drug_id,
        price: prices[i],
        weight: d.weight,
      })),
    );
  }
  return map;
};

// Deterministic wanted levels
export const createMockWantedByLocation = () => {
  const map = new Map<string, number>();
  const levels = [10, 25, 15, 30, 5, 20];
  mockLocations.forEach((loc, i) => {
    map.set(loc.location, levels[i]);
  });
  return map;
};

// Item infos with real icons
const createMockItemInfos = (
  slot: number,
  name: string,
  level: number,
  stat: number,
  cost: number,
  icon: React.FC<any>,
) => ({
  icon,
  level,
  slot,
  stat,
  cost,
  name,
  id: 1,
  tier: 1,
});

// SeasonSettings
export const createMockSeasonSettings = (overrides?: any) => ({
  season_version: "1",
  cash_mode: "Average",
  health_mode: "Hustler",
  turns_mode: "OnWeed",
  encounters_mode: "NoJokes",
  encounters_odds_mode: "Normal",
  drugs_mode: "Normal",
  wanted_mode: "ThugLife",
  ...overrides,
});

// GameConfig
export const createMockGameConfig = (overrides?: any) => ({
  season_version: "1",
  cash: 2000,
  health: 100,
  max_turns: 30,
  max_wanted_shopping: 5,
  rep_drug_step: 3,
  rep_buy_item: 3,
  rep_carry_drugs: 1,
  rep_hospitalized: 5,
  rep_jailed: 5,
  ...overrides,
});

// Game (gameInfos)
export const createMockGameInfos = (overrides?: any) => ({
  game_id: "0x1",
  player_id: "0x1234567890abcdef",
  player_name: { value: "0x506c61796572" }, // "Player" encoded
  season_version: "1",
  game_mode: "Ranked",
  registered: false,
  final_score: 0,
  token_id: 1,
  token_id_type: "LootId",
  // token_ids encode slot in byte 1: weapon=slot0, clothes=slot1, feet=slot5, transport=slot2
  equipment_by_slot: [1, 257, 1281, 513],
  ...overrides,
});

// Player
export const createMockPlayer = (overrides?: any) => ({
  _cash: 5000,
  cash: 5000,
  _reputation: 20,
  reputation: 20,
  health: 80,
  turn: 5,
  status: PlayerStatus.Normal,
  prevLocation: mockLocations[0],
  location: mockLocations[1],
  nextLocation: mockLocations[2],
  drugLevel: 0,
  wanted: 2,
  canBuy: () => true,
  canSell: () => true,
  ...overrides,
});

// Items with real icons
export const createMockItems = (overrides?: any) => ({
  attackLevelInit: 1,
  defenseLevelInit: 1,
  speedLevelInit: 0,
  transportLevelInit: 0,
  attackLevel: 1,
  defenseLevel: 1,
  speedLevel: 0,
  transportLevel: 0,
  attack: createMockItemInfos(0, "Knife", 1, 15, 200, Knife),
  defense: createMockItemInfos(1, "Kevlar", 1, 10, 150, Kevlar),
  speed: createMockItemInfos(2, "Shoes", 0, 0, 100, Shoes),
  transport: createMockItemInfos(3, "Car", 0, 0, 300, Car),
  gearItems: [],
  levelByItemSlot: [1, 1, 0, 0],
  ...overrides,
});

// Drugs (player inventory)
export const createMockDrugsInventory = (overrides?: any) => ({
  drug: mockDrugs[2], // Weed
  _drug: mockDrugs[2],
  quantity: 10,
  _quantity: 10,
  ...overrides,
});

// Wanted
export const createMockWanted = (overrides?: any) => ({
  wantedByLocation: createMockWantedByLocation(),
  getWantedTick: (locationId: number) => Math.min(locationId, 5),
  getValueByTick: (tick: number) => Math.floor(tick * (100 / 7)),
  ...overrides,
});

// Full mock game
export const createMockGame = (overrides?: any) => {
  const player = createMockPlayer(overrides?.player);
  const markets = {
    marketsByLocation: createMockMarketsByLocation(),
    getDrugPrice: (locationId: number, drugId: number) => 30,
    getTick: () => 3n,
    getDrugPriceByTick: () => 30,
    ...overrides?.markets,
  };

  return {
    configStore: null as any, // will be set by provider
    gameInfos: createMockGameInfos(overrides?.gameInfos),
    gameConfig: createMockGameConfig(overrides?.gameConfig),
    seasonSettings: createMockSeasonSettings(overrides?.seasonSettings),
    packed: 0n,
    player,
    markets,
    items: createMockItems(overrides?.items),
    drugs: createMockDrugsInventory(overrides?.drugs),
    wanted: createMockWanted(overrides?.wanted),
    pending: [],
    clearPendingCalls: () => {},
    pushCall: () => {},
    getPendingCalls: () => [],
    get isShopOpen() {
      return player.wanted < 5;
    },
    get shopCount() {
      return 0;
    },
    ...overrides,
  };
};

// Encounter event
export const createMockEncounter = (
  overrides?: Partial<TravelEncounter>,
): TravelEncounter => ({
  game_id: 1,
  player_id: "0x1234567890abcdef",
  turn: 3,
  encounter: Encounters.Cops,
  level: 2,
  health: 50,
  attack: 20,
  defense: 15,
  speed: 10,
  demand_pct: 30,
  payout: 500,
  ...overrides,
});

// Encounter result
export const createMockEncounterResult = (
  overrides?: Partial<TravelEncounterResult>,
): TravelEncounterResult => ({
  game_id: 1,
  player_id: "0x1234567890abcdef",
  turn: 3,
  action: "Fight",
  outcome: EncounterOutcomes.Victorious,
  rounds: 2,
  dmg_dealt: [
    [{ value: 15 }, { value: 3 }],
    [{ value: 20 }, { value: 0 }],
  ],
  dmg_taken: [
    [{ value: 10 }, { value: 2 }],
    [{ value: 5 }, { value: 0 }],
  ],
  cash_earnt: 500,
  cash_loss: 0,
  drug_id: 0,
  drug_loss: [0, 0],
  turn_loss: 0,
  rep_pos: 5,
  rep_neg: 0,
  ...overrides,
});

// EventClass (gameEvents)
export const createMockGameEvents = (overrides?: any) => ({
  events: [],
  sortedEvents: [],
  isGameOver: false,
  lastEncounter: overrides?.lastEncounter ?? null,
  lastEncounterResult: overrides?.lastEncounterResult ?? null,
  addEvent: () => {},
  ...overrides,
});

// RyoConfig
export const createMockRyoConfig = () => ({
  key: 0,
  initialized: true,
  paused: false,
  season_version: 1,
  season_duration: 604800,
  season_time_limit: 86400,
  paper_fee: 100,
  paper_reward_launderer: 50,
  treasury_fee_pct: 5,
  treasury_balance: 0,
});

// Full config store config
export const createMockConfig = () => ({
  ryo: createMockRyoConfig(),
  ryoAddress: { key: 0, paper: "0x0", laundromat: "0x0" },
  drug: mockDrugs,
  location: mockLocations,
  encounterStats: [],
  config: {
    layouts: {
      game_store: [
        { name: "Player", bits: 64n, idx: 0n },
        { name: "Markets", bits: 144n, idx: 64n },
        { name: "Items", bits: 8n, idx: 208n },
        { name: "Drugs", bits: 16n, idx: 216n },
        { name: "Wanted", bits: 18n, idx: 232n },
      ],
      player: [
        { name: "Cash", bits: 20n, idx: 0n },
        { name: "Health", bits: 7n, idx: 20n },
        { name: "Turn", bits: 5n, idx: 27n },
        { name: "Status", bits: 2n, idx: 32n },
        { name: "PrevLocation", bits: 3n, idx: 34n },
        { name: "Location", bits: 3n, idx: 37n },
        { name: "NextLocation", bits: 3n, idx: 40n },
        { name: "DrugLevel", bits: 3n, idx: 43n },
        { name: "Reputation", bits: 7n, idx: 46n },
      ],
    },
    ryo_config: createMockRyoConfig(),
    season_settings_modes: {
      cash_modes: ["Broke", "Average", "Rich"],
      health_modes: ["Junkie", "Hustler", "Streetboss"],
      turns_modes: ["OnSpeed", "OnWeed", "OnMush"],
      encounters_modes: ["Chill", "NoJokes", "UltraViolence"],
      encounters_odds_modes: ["Easy", "Normal", "Hard"],
      drugs_modes: ["Cheap", "Normal", "Expensive"],
    },
  },
  componentValues: [],
  dopewarsItemsTiers: [],
  dopewarsItemsTierConfigs: [],
});
