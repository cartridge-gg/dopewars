#[system]
mod SpawnSystem {
    use dojo::commands::Spawn;
    use components::Name;
    use components::Location;
    use components::Inventory;
    use components::Stats;

    fn execute(game_id: u32, name: felt252) {
        let player_id = Spawn::<(Game, Name, Location, Inventory, Stats)>::bundle((
            Game { id: game_id },
            Name { name: name },
            Location { id: 0 },
            Inventory { gun: 69 },
            Stats { health: 100 },
        ));
        return ();
    }
}
