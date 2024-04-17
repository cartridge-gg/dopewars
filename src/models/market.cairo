use rollyourown::models::location::LocationEnum;
use rollyourown::models::drug::DrugEnum;

#[derive(Model, Copy, Drop, Serde)]
struct Market {
    #[key]
    game_id: u32,
    #[key]
    location_id: LocationEnum,
    #[key]
    drug_id: DrugEnum,
    cash: u128, // fixed point
    quantity: usize,
}


#[generate_trait]
impl MarketImpl of MarketTrait {
    #[inline(always)]
    fn buy(ref self: Market, quantity: usize, scaling_factor: u128) -> u128 {
        assert(quantity < self.quantity, 'not enough liquidity');
        let (amount, available, cash) = normalize(quantity, self, scaling_factor);
        let k = cash * available;
        let cost = (k / (available - amount)) - cash;
        cost
    }

    #[inline(always)]
    fn sell(ref self: Market, quantity: usize, scaling_factor: u128) -> u128 {
        let (amount, available, cash) = normalize(quantity, self, scaling_factor);
        let k = cash * available;
        let payout = cash - (k / (available + amount));
        payout
    }
}


fn normalize(amount: usize, market: Market, scaling_factor: u128) -> (u128, u128, u128) {
    let amount: u128 = amount.into() * scaling_factor;
    let available: u128 = (market.quantity).into() * scaling_factor;
    (amount, available, market.cash)
}
