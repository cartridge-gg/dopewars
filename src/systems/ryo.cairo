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

    use rollyourown::models::ryo::{RyoMeta, RyoMetaManager, RyoMetaManagerTrait};
    use rollyourown::models::leaderboard::{Leaderboard};

    use rollyourown::utils::random::{RandomImpl};
    use rollyourown::utils::leaderboard::{LeaderboardManager, LeaderboardManagerTrait};

    use super::IRyo;

    #[external(v0)]
    impl RyoExternalImpl of IRyo<ContractState> {
        fn initialize(self: @ContractState) {
            let meta_manager = RyoMetaManagerTrait::new(self.world());
            let mut metas = meta_manager.get();

            assert(metas.initialized == false, 'Already initialized');

            // RyoMeta
            metas.initialized = true;
            metas.leaderboard_version = 1;
            meta_manager.set(metas);

            // Leaderboard
            set!(
                self.world(),
                Leaderboard {
                    version: metas.leaderboard_version,
                    high_score: 0,
                    next_version_timestamp: LeaderboardManagerTrait::get_next_version_timestamp(),
                }
            );
        }
    }

    #[generate_trait]
    impl RyoInternalImpl of RyoInternalTrait {}
}

