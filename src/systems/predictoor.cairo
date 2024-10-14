use starknet::ContractAddress;

#[starknet::interface]
trait IPredictoor<T> {
    fn predictoor(ref self: T, params: PredictoorParams) -> bool;
}

#[derive(Drop, Copy, Clone, Serde)]
pub struct PredictoorParams {
    drug: felt252,
}

#[dojo::contract]
mod predictoor {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use rollyourown::{
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
        utils::vrf_consumer::{VrfImpl, Source}
    };


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        PredictoorResultEvent: PredictoorResultEvent,
    }

    #[derive(Drop, starknet::Event)]
    struct PredictoorResultEvent {
        #[key]
        player_id: ContractAddress,
        value: felt252,
        win: bool
    }

    #[abi(embed_v0)]
    impl PredictoorImpl of super::IPredictoor<ContractState> {
        fn predictoor(ref self: ContractState, params: super::PredictoorParams) -> bool {
            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = VrfImpl::consume(ryo_addresses.vrf, Source::Nonce(player_id));

            let random: u256 = random.into();
            let value: felt252 = (random % 3).try_into().unwrap();

            if params.drug == value { // win
                self.emit(PredictoorResultEvent { player_id, value, win: true });
                true
            } else { // lose
                self.emit(PredictoorResultEvent { player_id, value, win: false });
                false
            }
            false
        }
    }

    #[generate_trait]
    impl PredictoorInternalImpl of PredictoorInternalTrait { // #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}

