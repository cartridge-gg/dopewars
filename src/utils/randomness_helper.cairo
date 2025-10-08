use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
use rollyourown::config::randomness::{RandomnessConfig, RandomnessConfigTrait, RandomnessMode};
use rollyourown::utils::random::{Random, RandomImpl};
use starknet::{get_block_timestamp, get_caller_address, get_tx_info};

#[generate_trait]
pub impl RandomnessHelperImpl of RandomnessHelperTrait {
    /// Generate random seed based on randomness config
    /// VRF mode: uses VRF provider
    /// Local mode: uses transaction hash + block timestamp + game context
    fn get_random_seed(config: RandomnessConfig, game_context: felt252) -> felt252 {
        match RandomnessConfigTrait::get_mode(config) {
            RandomnessMode::VRF(vrf_address) => {
                IVrfProviderDispatcher { contract_address: vrf_address }
                    .consume_random(Source::Nonce(get_caller_address()))
            },
            RandomnessMode::Local => {
                let tx_info = get_tx_info().unbox();
                let block_timestamp = get_block_timestamp();

                // Combine multiple entropy sources
                core::poseidon::poseidon_hash_span(
                    array![
                        tx_info.transaction_hash, block_timestamp.into(), game_context,
                        tx_info.nonce.try_into().unwrap_or(0),
                    ]
                        .span(),
                )
            },
        }
    }

    /// Create a Random instance using the appropriate randomness source
    fn create_randomizer(config: RandomnessConfig, game_context: felt252) -> Random {
        let seed = Self::get_random_seed(config, game_context);
        RandomImpl::new(seed)
    }

    /// Check if we should use local randomness (for conditional logic)
    fn is_local_mode(config: RandomnessConfig) -> bool {
        match RandomnessConfigTrait::get_mode(config) {
            RandomnessMode::Local => true,
            RandomnessMode::VRF(_) => false,
        }
    }
}
