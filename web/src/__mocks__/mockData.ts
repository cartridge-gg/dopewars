import { Encounters, EncounterOutcomes, PlayerStatus } from "@/dojo/types";
import {
  TravelEncounter,
  TravelEncounterResult,
} from "@/components/layout/GlobalEvents";

// Mock LocationConfigFull
export const createMockLocationConfig = (
  locationId: number,
  location: string,
  name: string,
) => ({
  location_id: locationId,
  location,
  name,
  icon: () => null,
});

export const mockLocations = [
  createMockLocationConfig(1, "Queens", "Queens"),
  createMockLocationConfig(2, "Bronx", "The Bronx"),
  createMockLocationConfig(3, "Brooklyn", "Brooklyn"),
  createMockLocationConfig(4, "Jersey", "Jersey City"),
  createMockLocationConfig(5, "Central", "Central Park"),
  createMockLocationConfig(6, "Coney", "Coney Island"),
];

// Mock DrugConfigFull
export const createMockDrugConfig = (
  drugId: number,
  drug: string,
  name: string,
  base: number,
  step: number,
  weight: number,
) => ({
  drug_id: drugId,
  drug,
  name,
  base,
  step,
  weight,
  drugs_mode: "Normal",
  icon: (props?: any) => null,
});

export const mockDrugs = [
  createMockDrugConfig(0, "Ludes", "Ludes", 10, 2, 1),
  createMockDrugConfig(1, "Speed", "Speed", 20, 4, 2),
  createMockDrugConfig(2, "Weed", "Weed", 30, 5, 3),
  createMockDrugConfig(3, "Shrooms", "Shrooms", 40, 8, 4),
  createMockDrugConfig(4, "Acid", "Acid", 50, 10, 5),
  createMockDrugConfig(5, "Ketamine", "Ketamine", 60, 12, 6),
  createMockDrugConfig(6, "Heroin", "Heroin", 80, 15, 8),
  createMockDrugConfig(7, "Cocaine", "Cocaine", 100, 20, 10),
];

// Mock market data
export const createMockMarketsByLocation = () => {
  const map = new Map<
    string,
    { drug: string; drugId: number; price: number; weight: number }[]
  >();
  for (const loc of mockLocations) {
    map.set(
      loc.location,
      mockDrugs.slice(0, 4).map((d) => ({
        drug: d.drug,
        drugId: d.drug_id,
        price: d.base + Math.floor(Math.random() * 50) + 10,
        weight: d.weight,
      })),
    );
  }
  return map;
};

// Mock wanted data
export const createMockWantedByLocation = () => {
  const map = new Map<string, number>();
  for (const loc of mockLocations) {
    map.set(loc.location, Math.floor(Math.random() * 30));
  }
  return map;
};

// Mock GearItemFull
const createMockGearItemFull = (
  slot: number,
  name: string,
  tier: number,
  stat: number,
  cost: number,
) => ({
  gearItem: { slot, item: 1 },
  name,
  tier,
  levels: [
    { cost: 0, stat: 0 },
    { cost, stat },
    { cost: cost * 2, stat: stat * 2 },
    { cost: cost * 3, stat: stat * 3 },
  ],
});

// Mock ItemInfos
const createMockItemInfos = (
  slot: number,
  name: string,
  level: number,
  stat: number,
  cost: number,
) => ({
  icon: () => null,
  level,
  slot,
  stat,
  cost,
  name,
  id: 1,
  tier: 1,
});

// Mock SeasonSettings
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

// Mock GameConfig
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

// Mock Game (gameInfos)
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
  equipment_by_slot: [1, 1, 1, 1],
  ...overrides,
});

// Mock Player
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

// Mock Items
export const createMockItems = (overrides?: any) => ({
  attackLevelInit: 1,
  defenseLevelInit: 1,
  speedLevelInit: 0,
  transportLevelInit: 0,
  attackLevel: 1,
  defenseLevel: 1,
  speedLevel: 0,
  transportLevel: 0,
  attack: createMockItemInfos(0, "Knife", 1, 15, 200),
  defense: createMockItemInfos(1, "Kevlar", 1, 10, 150),
  speed: createMockItemInfos(2, "Shoes", 0, 0, 100),
  transport: createMockItemInfos(3, "Car", 0, 0, 300),
  gearItems: [],
  levelByItemSlot: [1, 1, 0, 0],
  ...overrides,
});

// Mock Drugs (player inventory)
export const createMockDrugsInventory = (overrides?: any) => ({
  drug: mockDrugs[2],
  _drug: mockDrugs[2],
  quantity: 10,
  _quantity: 10,
  ...overrides,
});

// Mock Wanted
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

// Mock encounter event
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

// Mock encounter result
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

// Mock EventClass (gameEvents)
export const createMockGameEvents = (overrides?: any) => ({
  events: [],
  sortedEvents: [],
  isGameOver: false,
  lastEncounter: overrides?.lastEncounter ?? null,
  lastEncounterResult: overrides?.lastEncounterResult ?? null,
  addEvent: () => {},
  ...overrides,
});

// Mock RyoConfig
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

// Mock Config (full config store config)
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
