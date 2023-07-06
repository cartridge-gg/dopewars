#[system]
mod set_name {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;
    use rollyourown::components::game::Game;
    use rollyourown::components::player::Player;

    fn execute(ctx: Context, game_id: u32, player_name: felt252) {
        let player_id: felt252 = ctx.origin.into();
        let player_sk: Query = (game_id, player_id).into();
        let player = get !(ctx.world, player_sk, (Player));

        set !(
            ctx.world,
            player_sk,
            (Player {
                name: player_name,
                cash: player.cash,
                health: player.health,
                arrested: player.arrested,
                turns_remaining: player.turns_remaining,
            })
        )
    }
}
