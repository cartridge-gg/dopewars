import { computed, makeObservable, observable } from "mobx";
import { ConfigStoreClass, HustlerConfig } from "../stores/config";
import { ItemSlot, ShopAction } from "../types";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, isShopAction } from "./Game";
import Bits from "./utils/Bits";

export class ItemsClass extends GamePropertyClass {
  bitsSize = 2n;
  maxLevel = 3;
  //
  attackLevel: number;
  defenseLevel: number;
  speedLevel: number;
  transportLevel: number;
  //
  hustlerConfig: HustlerConfig;

  constructor(game: GameClass, packed: bigint) {
    super(game, packed);

    this.hustlerConfig = game.configStore.getHustlerById(this.game.gameInfos.hustler_id);

    this.attackLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Weapon) * this.bitsSize, this.bitsSize));
    this.defenseLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Clothes) * this.bitsSize, this.bitsSize));
    this.speedLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Feet) * this.bitsSize, this.bitsSize));
    this.transportLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Transport) * this.bitsSize, this.bitsSize));

    makeObservable(this, {
      attack: computed,
      defense: computed,
      speed: computed,
      transport: computed,
      attackUpgrade: computed,
      defenseUpgrade: computed,
      speedUpgrade: computed,
      transportUpgrade: computed,
      fullStuff: computed,
      game: observable,
    });
  }

  get attack() {
    let level = this.attackLevel;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Weapon).length;
    }
    return this.game.configStore.getHustlerItemByIds(this.hustlerConfig.weapon.base.id, ItemSlot.Weapon, level);
  }

  get defense() {
    let level = this.defenseLevel;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Clothes).length;
    }

    return this.game.configStore.getHustlerItemByIds(this.hustlerConfig.clothes.base.id, ItemSlot.Clothes, level);
  }

  get speed() {
    let level = this.speedLevel;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Feet).length;
    }

    return this.game.configStore.getHustlerItemByIds(this.hustlerConfig.feet.base.id, ItemSlot.Feet, level);
  }

  get transport() {
    let level = this.transportLevel;
    if (this.game?.pending && this.game?.pending?.length > 0) {
      level += this.game.pending
        .filter(isShopAction)
        .map((i) => i as ShopAction)
        .filter((i) => i.slot === ItemSlot.Transport).length;
    }
    return this.game.configStore.getHustlerItemByIds(this.hustlerConfig.transport.base.id, ItemSlot.Transport, level);
  }

  get attackUpgrade() {
    if (this.attack!.level < this.maxLevel) {
      return this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.weapon.base.id,
        ItemSlot.Weapon,
        this.attack!.level + 1,
      );
    }
    return undefined;
  }

  get defenseUpgrade() {
    if (this.defense!.level < this.maxLevel) {
      return this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.clothes.base.id,
        ItemSlot.Clothes,
        this.defense!.level + 1,
      );
    }
    return undefined;
  }

  get speedUpgrade() {
    if (this.speed!.level < this.maxLevel) {
      return this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.feet.base.id,
        ItemSlot.Feet,
        this.speed!.level + 1,
      );
    }
    return undefined;
  }

  get transportUpgrade() {
    if (this.transport!.level < this.maxLevel) {
      return this.game.configStore.getHustlerItemByIds(
        this.hustlerConfig.transport.base.id,
        ItemSlot.Transport,
        this.transport!.level + 1,
      );
    }
    return undefined;
  }

  get fullStuff() {
    return  this.attackUpgrade === undefined &&
      this.defenseUpgrade === undefined &&
      this.speedUpgrade === undefined &&
      this.transportUpgrade === undefined;
   
  }
}
