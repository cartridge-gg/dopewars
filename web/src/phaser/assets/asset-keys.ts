export const WORLD_ASSET_KEYS = Object.freeze({
  WORLD_BACKGROUND: "WORLD_BACKGROUND",
  WORLD_MAIN_LEVEL: "WORLD_MAIN_LEVEL",
  WORLD_COLLISION: "WORLD_COLLISION",
  WORLD_FOREGROUND: "WORLD_FOREGROUND",
  //   WORLD_ENCOUNTER_ZONE: "WORLD_ENCOUNTER_ZONE",
});

export const CHARACTER_ASSET_KEYS = Object.freeze({
  PLAYER: "PLAYER",
  NPC: "NPC",
});

export const DATA_ASSET_KEYS = Object.freeze({
  ANIMATIONS: "ANIMATIONS",
});

// BATTLE SCENE KEYS
export const ASSET_KEYS = Object.freeze({
  // Background
  CITY: "CITY",

  // CHARCACTER
  MAFIA: "MAFIA",
  POLICE: "POLICE",

  // Health components
  HEALTH_BAR_BACKGROUND: "HEALTH_BAR_BACKGROUND",
  LEFT_CAP: "LEFT_CAP",
  MIDDLE: "MIDDLE",
  RIGHT_CAP: "RIGHT_CAP",
  LEFT_CAP_SHADOW: "LEFT_CAP_SHADOW",
  MIDDLE_SHADOW: "MIDDLE_SHADOW",
  RIGHT_CAP_SHADOW: "RIGHT_CAP_SHADOW",

  // Cursor
  CURSOR: "CURSOR",
  CURSOR_X: 57,
  CURSOR_Y: 36,

  // Attacks
  ATTACKS: "ATTACKS",
});

export const BATTLE_MENU_OPTIONS = Object.freeze({
  FIGHT: "FIGHT",
  PAY: "PAY",
  RUN: "RUN",
});
export type battleMenuOptions = keyof typeof BATTLE_MENU_OPTIONS;

export const BATTLE_UI_TEXT_STYLE = Object.freeze({
  color: "#FF52A2",
  fontSize: "30px",
});

export const DIRECTION = Object.freeze({
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN",
  NONE: "NONE",
} as const);
export type direction = keyof typeof DIRECTION;
