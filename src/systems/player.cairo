#[system]
mod set_name {
    use array::ArrayTrait;
    use traits::Into;

    use dojo::world::Context;
    use rollyourown::components::game::Game;
    use rollyourown::components::name::Name;

    fn execute(ctx: Context, game_id: u32, player_name: felt252) {
        set!(ctx.world, (Name { game_id, player_id: ctx.origin, short_string: player_name,  }))
    }
}
