import { ConfigStore, DrugConfigFull } from "../stores/config";
import { TradeAction, TradeDirection } from "../types";
import { GamePropertyClass } from "./ GameProperty";
import { GameClass, isTradeAction } from "./Game";
import Bits from "./utils/Bits";

export class DrugsClass extends GamePropertyClass {
    private _drug: DrugConfigFull | undefined;
    private _quantity: number;

    constructor(configStore: ConfigStore, game: GameClass, packed: bigint) {
        super(configStore, game, packed);

        const drugId = Number(Bits.extract(this.packed, 0n, 3n));
        this._quantity = Number(Bits.extract(this.packed, 3n, 13n));

        this._drug = this.quantity > 0 ?
            configStore.getDrugById(drugId)
            : undefined

    }

    get drug() {
        if (this.game?.pending?.length === 0) return this._drug

        const { drug } = this.simulateTrades()
        return drug
    }

    get quantity() {
        if (this.game?.pending?.length === 0) return this._quantity

        const { quantity } = this.simulateTrades()
        return quantity
    }

    private simulateTrades = () => {
        let drug = this._drug
        let quantity = this._quantity

        if (!this.game?.pending || this.game?.pending?.length === 0) return { drug, quantity }
        const trades = this.game.pending.filter(isTradeAction).map(i => i as TradeAction)

        for (let trade of trades) {
            if (trade.direction === TradeDirection.Buy) {
                if (!drug || drug.drug_id === trade.drug) {
                    drug = this.configStore.getDrugById(trade.drug)
                    quantity += trade.quantity
                }
                else {
                    console.log("******* should not happend")
                }

            }

            if (trade.direction === TradeDirection.Sell) {
                if (drug && drug.drug_id === trade.drug) {
                    quantity -= trade.quantity
                    if (quantity === 0) {
                        drug = undefined
                    }
                }
                else {
                    console.log("******* should not happend")
                }
            }
        }
        return {
            drug,
            quantity
        }

    }
}