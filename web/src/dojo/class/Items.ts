import { GearItemFull, HustlerItemConfigFull } from "@/dojo/stores/config";
import { computed, makeObservable, observable } from "mobx";
import { ConfigStoreClass, HustlerConfig } from "../stores/config";
import { ItemSlot, ShopAction } from "../types";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, isShopAction } from "./Game";
import Bits from "./utils/Bits";
import { GearItem, getGearItem } from "@dope/dope-sdk/helpers";
import { Car, Cigarette } from "@/components/icons";
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

const hustlerItemConfigFullToItemInfos = (level: number, item: HustlerItemConfigFull): ItemInfos => {
  return {
    icon: item.icon,
    level: level,
    slot: item.slot,
    stat: item.tier.stat,
    cost: item.tier.cost,
    name: item.base.name,
  };
};
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
  hustlerConfig: HustlerConfig;
  //
  gearItems: GearItem[];

  constructor(game: GameClass, packed: bigint) {
    super(game, packed);

    this.hustlerConfig = game.configStore.getHustlerById(this.game.gameInfos.hustler_id);

    this.attackLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Weapon) * this.bitsSize, this.bitsSize));
    this.defenseLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Clothes) * this.bitsSize, this.bitsSize));
    this.speedLevelInit = Number(Bits.extract(this.packed, BigInt(ItemSlot.Feet) * this.bitsSize, this.bitsSize));
    this.transportLevelInit = Number(
      Bits.extract(this.packed, BigInt(ItemSlot.Transport) * this.bitsSize, this.bitsSize),
    );

    this.levelByItemSlot = [this.attackLevelInit, this.defenseLevelInit, this.speedLevelInit, this.transportLevelInit];

    this.gearItems = [];
    if (game.gameWithTokenId) {
      this.gearItems = game.gameWithTokenId.equipment_by_slot.map((gearItemId) => {
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

    if (!this.game.gameWithTokenId) {
      const item = this.game.configStore.getHustlerItemByIds(this.hustlerConfig.weapon.base.id, ItemSlot.Weapon, level);
      return hustlerItemConfigFullToItemInfos(level, item);
    } else {
      const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Weapon]);
      return gearItemFullToItemInfos(level, item, Knife);
    }
  }

  get defense() {
    let level = this.defenseLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Clothes).length;
    }

    if (!this.game.gameWithTokenId) {
      const item = this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.clothes.base.id,
        ItemSlot.Clothes,
        level,
      );
      return hustlerItemConfigFullToItemInfos(level, item);
    } else {
      const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Clothes]);
      return gearItemFullToItemInfos(level, item, Kevlar);
    }
  }

  get speed() {
    let level = this.speedLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Feet).length;
    }
    if (!this.game.gameWithTokenId) {
      const item = this.game.configStore.getHustlerItemByIds(this.hustlerConfig.feet.base.id, ItemSlot.Feet, level);
      return hustlerItemConfigFullToItemInfos(level, item);
    } else {
      const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Feet]);
      return gearItemFullToItemInfos(level, item, Shoes);
    }
  }

  get transport() {
    let level = this.transportLevelInit;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Transport).length;
    }
    if (!this.game.gameWithTokenId) {
      const item = this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.transport.base.id,
        ItemSlot.Transport,
        level,
      );
      return hustlerItemConfigFullToItemInfos(level, item);
    } else {
      const item = this.game.configStore.getGearItemFull(this.gearItems[ItemSlot.Transport]);
      return gearItemFullToItemInfos(level, item, Car);
    }
  }
}
