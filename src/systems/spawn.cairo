#[system]
mod SpawnSystem {
    use dojo::commands::Spawn;
    use components::Name;
    use components::Location;
    use components::Inventory;
    use components::Stats;

    fn execute(game_id: felt252, name: felt252) {
        let player_id = Spawn::bundle((game_id), (
            Game { id: game_id },
            Name { name: name },
            Location { id: 0 },
            Inventory { gun: 69 },
            Stats { health: 100 },
        ));
        return ();
    }
}
