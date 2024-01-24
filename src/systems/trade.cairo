use starknet::ContractAddress;
use rollyourown::models::location::{LocationEnum};
use rollyourown::models::drug::{DrugEnum};


#[starknet::interface]
trait ITrade<TContractState> {
    fn buy(
        self: @TContractState,
        game_id: u32,
        location_id: LocationEnum,
        drug_id: DrugEnum,
        quantity: usize
    );

    fn sell(
        self: @TContractState,
        game_id: u32,
        location_id: LocationEnum,
        drug_id: DrugEnum,
        quantity: usize
    );
}


#[dojo::contract]
mod trade {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    use rollyourown::models::drug::{Drug, DrugEnum};
    use rollyourown::models::player::{Player, PlayerTrait};
    use rollyourown::models::location::{Location, LocationEnum};
    use rollyourown::models::game::{Game};

    use rollyourown::models::market_packed::{MarketImpl, MarketTrait};

    use rollyourown::utils::math::{MathTrait, MathImplU8};

    use super::ITrade;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Bought: Bought,
        Sold: Sold
    }

    #[derive(Drop, starknet::Event)]
    struct Bought {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        drug_id: DrugEnum,
        quantity: usize,
        cost: u32
    }

    #[derive(Drop, starknet::Event)]
    struct Sold {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        drug_id: DrugEnum,
        quantity: usize,
        payout: u32
    }


    #[external(v0)]
    impl GameImpl of ITrade<ContractState> {
        // 1. Verify the caller owns the player.
        // 2. Get current price for location for quantity.
        // 3. Ensure user can afford it.
        // 4. Perform the trade.
        // 5. Update the location's inventory.
        // 6. Update the player's inventory.
        fn buy(
            self: @ContractState,
            game_id: u32,
            location_id: LocationEnum,
            drug_id: DrugEnum,
            quantity: usize
        ) {
            let world = self.world();
            let player_id = get_caller_address();

            let game = get!(world, game_id, (Game));
            //assert(game.tick(), 'cannot progress');

            let mut player = get!(world, (game_id, player_id).into(), Player);
            assert(player.location_id == location_id, 'player is not at location');
            assert(player.can_continue(), 'player cannot trade');
            assert(player.drug_count + quantity <= player.get_transport(world), 'no bag space');

            // let mut market = get!(world, (game_id, location_id, drug_id).into(), Market);
            let mut market = MarketImpl::get(world, game_id, player_id);

            let cost = market.quote_buy(location_id,drug_id, quantity);
            assert(cost.into() < player.cash, 'not enough cash');

            let mut drug = get!(world, (game_id, player_id, drug_id).into(), Drug);

            // todo: calc tick shift 
            let tick = market.get_tick(location_id,drug_id);
            let new_tick = tick.add_capped(1,63);
            market.set_tick(location_id, drug_id, new_tick);

            // // update market
            // market.cash += cost;
            // market.quantity -= quantity;

            // update player
            player.cash -= cost.into();
            player.drug_count += quantity;

            // update drug
            drug.quantity += quantity;

            set!(world, (market, player, drug));
            emit!(world, Bought { game_id, player_id, drug_id, quantity, cost });
        }


        fn sell(
            self: @ContractState,
            game_id: u32,
            location_id: LocationEnum,
            drug_id: DrugEnum,
            quantity: usize
        ) {
            let world = self.world();
            let player_id = get_caller_address();

            let game = get!(world, game_id, Game);
            //assert(game.tick(), 'cannot progress');

            let mut player = get!(world, (game_id, player_id).into(), Player);
            assert(player.location_id == location_id, 'player is not at location');

            let mut drug = get!(world, (game_id, player_id, drug_id).into(), Drug);
            assert(drug.quantity >= quantity, 'not enough drugs to sell');

           // let mut market = get!(world, (game_id, location_id, drug_id).into(), Market);
            let mut market = MarketImpl::get(world, game_id, player_id);

            let payout = market.quote_sell(location_id,drug_id,quantity);

            // todo: calc tick shift
            let tick = market.get_tick(location_id,drug_id);
            let new_tick = tick.sub_capped(1,0);
            market.set_tick(location_id, drug_id, new_tick);

            // // update market
            // market.quantity += quantity;
            // market.cash -= payout;

            // update player
            player.cash += payout.into();
            player.drug_count -= quantity;

            // update drug
            drug.quantity -= quantity;

            set!(world, (market, player, drug));
            emit!(world, Sold { game_id, player_id, drug_id, quantity, payout });
        }
    }
}

