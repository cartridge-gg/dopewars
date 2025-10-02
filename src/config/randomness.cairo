use starknet::ContractAddress;
use core::num::traits::Zero;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct RandomnessConfig {
    #[key]
    pub key: u8,
    pub use_vrf: bool,
    pub vrf_provider: ContractAddress,
}

#[derive(Copy, Drop)]
pub enum RandomnessMode {
    VRF: ContractAddress,
    Local,
}

#[generate_trait]
pub impl RandomnessConfigImpl of RandomnessConfigTrait {
    fn get_mode(config: RandomnessConfig) -> RandomnessMode {
        if config.use_vrf && !config.vrf_provider.is_zero() {
            RandomnessMode::VRF(config.vrf_provider)
        } else {
            RandomnessMode::Local
        }
    }

    fn default() -> RandomnessConfig {
        RandomnessConfig {
            key: 0,
            use_vrf: true,
            vrf_provider: Zero::zero(),
        }
    }
}