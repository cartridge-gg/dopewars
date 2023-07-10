#[system]
mod set_name {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;
    use rollyourown::components::game::Game;
    use rollyourown::components::name::Name;

    fn execute(ctx: Context, game_id: u32, player_name: felt252) {
        let player_id: felt252 = ctx.origin.into();
        let player_sk: Query = (game_id, player_id).into();

        set !(ctx.world, player_sk, (Name { short_string: player_name,  }))
    }
}
