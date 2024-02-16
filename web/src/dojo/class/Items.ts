import { computed, makeObservable, observable } from "mobx";
import { ConfigStore } from "../stores/config";
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

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        this.attackLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Attack) * this.bitsSize, this.bitsSize));
        this.defenseLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Defense) * this.bitsSize, this.bitsSize));
        this.speedLevel = Number(Bits.extract(this.packed, BigInt(ItemSlot.Speed) * this.bitsSize, this.bitsSize));
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
            game: observable,
        })

    }

    get attack() {
        let level = this.attackLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Attack)
                .length
        }
        return this.configStore.getItemByIds(ItemSlot.Attack, level)
    }

  
    get defense() {
        let level = this.defenseLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Defense)
                .length
        }

        return this.configStore.getItemByIds(ItemSlot.Defense, level)
    }

    get speed() {
        let level = this.speedLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Speed)
                .length
        }

        return this.configStore.getItemByIds(ItemSlot.Speed, level)
    }

    get transport() {
        let level = this.transportLevel
        if (this.game?.pending && this.game?.pending?.length > 0) {
            level += this.game.pending
                .filter(isShopAction)
                .map(i => i as ShopAction)
                .filter(i => i.slot === ItemSlot.Transport)
                .length
        }
        return this.configStore.getItemByIds(ItemSlot.Transport, level)
    }


    get attackUpgrade(){
        if (this.attack!.level_id < this.maxLevel){
            return this.configStore.getItemByIds(ItemSlot.Attack, this.attack!.level_id+1)
        }
        return undefined
    }

    get defenseUpgrade(){
        if (this.defense!.level_id < this.maxLevel){
            return this.configStore.getItemByIds(ItemSlot.Defense, this.defense!.level_id+1)
        }
        return undefined
    }

    get speedUpgrade(){
        if (this.speed!.level_id < this.maxLevel){
            return this.configStore.getItemByIds(ItemSlot.Speed, this.speed!.level_id+1)
        }
        return undefined
    }

    get transportUpgrade(){
        if (this.transport!.level_id < this.maxLevel){
            return this.configStore.getItemByIds(ItemSlot.Transport, this.transport!.level_id+1)
        }
        return undefined
    }
}