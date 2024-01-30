import { ConfigStore } from "../stores/config";
import { Drug, DrugMarket, LocationPrices } from "../types";


// todo load config from contracts
const get_drug_price_config = (drug: Drug) => {
  switch (drug) {
    case Drug.Ludes:
      return { base: 18n, step: 1n };
    case Drug.Speed:
      return { base: 85n, step: 6n };
    case Drug.Weed:
      return { base: 420n, step: 23n };
    case Drug.Acid:
      return { base: 1590n, step: 69n };
    case Drug.Heroin:
      return { base: 5720n, step: 169n };
    case Drug.Cocaine:
      return { base: 12200n, step: 242n };
    default:
      return { base: 1n, step: 1n };
  }
};

class MarketPackedHelper {
  packed: bigint;

  constructor(packed: any) {
    this.packed = BigInt(packed);
  }

  get_tick(location_id: number, drug_id: Drug) {
    const location_count = 6n;
    const size = 6n;
    const start = BigInt((BigInt(location_id) * location_count + BigInt(drug_id)) * size);
    const mask = BigInt(Math.pow(2, 6) - 1);

    const shifted = this.packed >> start;

    return shifted & mask;
  }

  get_drug_price_by_tick(drug_id: Drug, tick: bigint) {
    const drug_price = get_drug_price_config(drug_id);
    return tick * drug_price.step + drug_price.base;
  }

  get_drug_price(location_id: number, drug: Drug) {
    const tick = this.get_tick(location_id, drug);
    return this.get_drug_price_by_tick(drug, tick);
  }
}

export class MarketPrices {
  locationPrices: LocationPrices;

  constructor(locationMarkets: LocationPrices) {
    this.locationPrices = locationMarkets;
  }

  static create(configStore: ConfigStore,packed: string): LocationPrices {
    console.log(`MarketPrices.create`);
   
    const market = new MarketPackedHelper(packed);

    const locationPrices: LocationPrices = new Map();

    for (let locationId of [ 1, 2, 3, 4, 5, 6]) {

      for (let drugId of [0, 1, 2, 3, 4, 5]) {
        const price = market.get_drug_price(locationId-1, drugId as Drug);
       
        const drug = configStore.getDrugById(drugId)!;
        const location = configStore.getLocationById(locationId)!;

        const drugMarket: DrugMarket = {
          drug: drug.drug,
          drugId: drug.drug_id,
          price: Number(price),
          weight: drug.weight / 100
        };

        if (locationPrices.has(location.location)) {
          locationPrices.get(location.location)?.push(drugMarket);
        } else {
          locationPrices.set(location.location, [drugMarket]);
        }
      }
    }
    //

    return locationPrices;
  }
}
