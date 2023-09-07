#[system]
mod travel {
    use traits::Into;
    use box::BoxTrait;
    use array::ArrayTrait;
    use starknet::ContractAddress;

    use dojo::world::Context;

    use rollyourown::PlayerState;
    use rollyourown::components::{game::{Game, GameTrait}, location::Location};
    use rollyourown::components::player::{Player, PlayerTrait};
    use rollyourown::components::risks::{Risks, RisksTrait, TravelResult};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Traveled: Traveled,
        RandomEvent: RandomEvent,
    }

    #[derive(Drop, starknet::Event)]
    struct Traveled {
        game_id: u32,
        player_id: ContractAddress,
        from_location: felt252,
        to_location: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct RandomEvent {
        game_id: u32,
        player_id: ContractAddress,
        player_state: PlayerState,
    }


    // 1. Verify the caller owns the player.
    // 2. Determine if a random travel event occurs and apply it if necessary.
    // 3. Update the players location to the next_location_id.
    // 4. Update the new locations supply based on random events.
    fn execute(ctx: Context, game_id: u32, next_location_id: felt252) -> bool {
        let game = get !(ctx.world, game_id, Game);
        assert(game.tick(), 'game cannot progress');

        let player_id = ctx.origin;
        let mut player = get !(ctx.world, (game_id, player_id).into(), Player);
        assert(player.can_continue(), 'player cannot travel');
        assert(player.location_id != next_location_id, 'already at location');

        let mut risks = get !(ctx.world, (game_id, next_location_id).into(), Risks);
        let seed = starknet::get_tx_info().unbox().transaction_hash;

        if risks.travel(seed) {
            player.state = PlayerState::BeingMugged(());
            set !(ctx.world, (player));

            emit !(
                ctx.world,
                RandomEvent { game_id, player_id, player_state: PlayerState::BeingMugged(()) }
            );

            return true;
        }

        player.location_id = next_location_id;
        player.turns_remaining -= 1;
        set !(ctx.world, (player));

        emit !(
            ctx.world,
            Traveled {
                game_id, player_id, from_location: player.location_id, to_location: next_location_id
            }
        );

        false
    }
}
