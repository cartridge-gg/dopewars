use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

const GAME_CONFIG_KEY: u8 = 0;

#[derive(Model, Copy, Drop, Serde)]
struct GameConfig {
    #[key]
    key: u8,
    cash: u32,
    health: u8,
    max_turns: u8,
    max_wanted_shopping: u8,
    max_rounds: u8,
}

#[generate_trait]
impl GameConfigImpl of GameConfigTrait {
    #[inline(always)]
    fn get(world: IWorldDispatcher) -> GameConfig {
        get!(world, (GAME_CONFIG_KEY), GameConfig)
    }
}

fn initialize_game_config(world: IWorldDispatcher) {
    set!(
        world,
        GameConfig {
            key: GAME_CONFIG_KEY,
            cash: 420,
            health: 100, // 100,
            max_turns: 42,
            max_wanted_shopping: 5,
            max_rounds: 3,
        }
    );
}

