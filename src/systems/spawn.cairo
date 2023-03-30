#[system]
mod SpawnPlayer {
    use array::ArrayTrait;
    use traits::Into;  

    use rollyourown::components::player::Name;
    use rollyourown::components::player::Location;
    use rollyourown::components::player::Inventory;
    use rollyourown::components::player::Stats;

    fn execute(game_id: felt252, name: felt252) {
        let player_id: felt252 = starknet::get_caller_address().into();
        let player_game_id = commands::set((game_id, (player_id)).into(), (
            Name { name: name },
            Location { id: 0_u32 },
            Inventory { weapon: 69_u32, shoes: 1337_u32 },
            Stats { health: 100_u8 },
        ));
        return ();
    }
}
