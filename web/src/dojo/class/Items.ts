import { GearItemFull } from "@/dojo/stores/config";
import { computed, makeObservable, observable } from "mobx";
import { ItemSlot, ShopAction } from "../types";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, isShopAction } from "./Game";
import Bits from "./utils/Bits";
import { GearItem, getGearItem } from "@/dope/helpers";
import { Car } from "@/components/icons";
import { Kevlar, Knife, Shoes } from "@/components/icons/items";
import { dopeLootSlotIdToItemSlot } from "../helpers";

export interface ItemInfos {
  icon: React.FC;
  level: number;
  slot: ItemSlot;
  stat: number;
  cost: number;
  name: string;
  id?: number;
  tier?: number;
}

const gearItemFullToItemInfos = (level: number, item: GearItemFull, icon: React.FC): ItemInfos => {
  return {
    icon,
    level,
    slot: dopeLootSlotIdToItemSlot[item.gearItem.slot as keyof typeof dopeLootSlotIdToItemSlot],
    stat: item.levels[level].stat,
    cost: item.levels[level].cost,
    name: item.name,
    tier: item.tier,
    id: item.gearItem.item,
  };
};

export class ItemsClass extends GamePropertyClass {
  bitsSize = 2n;
  maxLevel = 3;
  //
  attackLevelInit: number;
  defenseLevelInit: number;
  speedLevelInit: number;
  transportLevelInit: number;
  levelByItemSlot: number[];
  //
  gearItems: GearItem[];

  constructor(game: GameClass, packed: bigint) {
    super(game, packed);

    this.attackLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Weapon) * this.bitsSize, this.bitsSize));
    this.defenseLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Clothes) * this.bitsSize, this.bitsSize));
    this.speedLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Feet) * this.bitsSize, this.bitsSize));
    this.transportLevelInit = Number(
      Bits.extract(this.packed, BigInt(ItemSlot.Transport) * this.bitsSize, this.bitsSize),
    );

    this.levelByItemSlot = [this.attackLevelInit, this.defenseLevelInit, this.speedLevelInit, this.transportLevelInit];

    this.gearItems = [];
    if (game.gameInfos) {
      this.gearItems = (game.gameInfos.equipment_by_slot || []).map((gearItemId) => {
        return getGearItem(BigInt(gearItemId));
      });
    }

    makeObservable(this, {
      attackLevel: computed,
      defenseLevel: computed,
      speedLevel: computed,
      transportLevel: computed,
      attack: computed,
      defense: computed,
      speed: computed,
      transport: computed,
      game: observable,
    });
  }

  get attackLevel() {
    let level = this.attackLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Weapon).length;
    }
    return level;
  }

  get defenseLevel() {
    let level = this.defenseLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Clothes).length;
    }
    return level;
  }

  get speedLevel() {
    let level = this.speedLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Feet).length;
    }
    return level;
  }

  get transportLevel() {
    let level = this.transportLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Transport).length;
    }
    return level;
  }

  get attack() {
    let level = this.attackLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Weapon).length;
    }

    const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Weapon]);
    return gearItemFullToItemInfos(level, item, Knife);
  }

  get defense() {
    let level = this.defenseLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Clothes).length;
    }

    const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Clothes]);
    return gearItemFullToItemInfos(level, item, Kevlar);
  }

  get speed() {
    let level = this.speedLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Feet).length;
    }

    const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Feet]);
    return gearItemFullToItemInfos(level, item, Shoes);
  }

  get transport() {
    let level = this.transportLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Transport).length;
    }

    const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Transport]);
    return gearItemFullToItemInfos(level, item, Car);
  }
}
