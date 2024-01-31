#[starknet::interface]
trait IConfig<T> {
    fn initialize(ref self: T);
// fn update_drug_config(ref self: T);
// fn update_drug_config_meta(ref self: T);
// ...
}


#[dojo::contract]
mod config {
    use rollyourown::config::{
        drugs::initialize_drug_config,
        locations::initialize_location_config,
        items::initialize_item_config,
        game::initialize_game_config,
    };

    #[abi(embed_v0)]
    impl ConfigImpl of super::IConfig<ContractState> {
        fn initialize(ref self: ContractState) {
            // TODO checks

            // only world owner
            assert(self.world().is_owner(starknet::get_caller_address(),0), 'only world owner');

            initialize_drug_config(self.world());
            initialize_location_config(self.world());
            initialize_item_config(self.world());

            initialize_game_config(self.world());
        }
    }
}
