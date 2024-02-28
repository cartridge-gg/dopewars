use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IRyo<TContractState> {
    fn initialize(self: @TContractState);
}

#[dojo::contract]
mod ryo {
    use core::traits::Into;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::contract_address::Felt252TryIntoContractAddress;
    use starknet::info::get_tx_info;

    use rollyourown::{
        models::{ryo::{RyoMeta, RyoMetaManager, RyoMetaManagerTrait}, leaderboard::Leaderboard,},
        utils::random::{RandomImpl},
        systems::leaderboard::{LeaderboardManager, LeaderboardManagerTrait}
    };


    #[abi(embed_v0)]
    impl RyoExternalImpl of super::IRyo<ContractState> {
        fn initialize(self: @ContractState) {
            //todo check caller is  owner
            let meta_manager = RyoMetaManagerTrait::new(self.world());
            let mut metas = meta_manager.get();

            assert(metas.initialized == false, 'Already initialized');

            // RyoMeta
            metas.initialized = true;
            metas.leaderboard_version = 1;
            meta_manager.set(metas);

            // Leaderboard
            let leaderboard_manager = LeaderboardManagerTrait::new(self.world());
            leaderboard_manager.new_leaderboard(metas.leaderboard_version);
        }
    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {}
}

