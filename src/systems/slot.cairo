use rollyourown::utils::bits::{BitsImpl, BitsTrait};

// #[cfg(test)]
// mod tests {
//     use super::{MACHINE, get_slot};

//     #[test]
//     fn test_slot() {
//         println!("0,3: {}", get_slot(0, 3));
//         println!("1,21: {}", get_slot(1, 21));
//     }
// }

//
// Contract
//

use starknet::ContractAddress;

pub const SLOT_BY_ROLL: u8 = 22;
pub const ROLL_R: [u8; 22] = [2, 0, 1, 7, 2, 4, 0, 1, 0, 3, 2, 0, 2, 5, 0, 1, 0, 6, 0, 3, 2, 1];
pub const ROLL_Y: [u8; 22] = [7, 5, 0, 2, 0, 1, 4, 2, 5, 0, 3, 0, 6, 1, 3, 2, 0, 1, 6, 0, 1, 4];
pub const ROLL_O: [u8; 22] = [4, 1, 3, 4, 2, 5, 1, 0, 1, 5, 0, 2, 1, 4, 3, 1, 0, 2, 0, 3, 6, 7];

pub const MACHINE: [[u8; 22]; 3] = [ROLL_R, ROLL_Y, ROLL_O];

pub fn get_slot(roll: u8, index: u8) -> u8 {
    *(*MACHINE.span().at(roll.into())).span().at(index.into())
}

pub fn is_XXW(values: (u8, u8, u8)) -> Option<u8> {
    let (r, y, _) = values;
    match r == y {
        true => Option::Some(r),
        false => Option::None,
    }
}

pub fn is_XWX(values: (u8, u8, u8)) -> Option<u8> {
    let (r, _, o) = values;
    match r == o {
        true => Option::Some(r),
        false => Option::None,
    }
}

pub fn is_WXX(values: (u8, u8, u8)) -> Option<u8> {
    let (_, y, o) = values;
    match y == o {
        true => Option::Some(y),
        false => Option::None,
    }
}

pub fn get_XX_payout(value: u8) -> u32 {
    if value == 7 {
        return 3;
    }
    if value == 6 {
        return 3;
    }
    if value == 5 {
        return 2;
    }
    if value == 4 {
        return 2;
    }
    1
}


pub fn check_combinations(values: (u8, u8, u8)) -> Option<(felt252, (u8, u8, u8), u32)> {
    if values == (7, 7, 7) {
        return Option::Some(('7,7,7', values, 50));
    }
    if values == (6, 6, 6) {
        return Option::Some(('6,6,6', values, 25));
    }
    if values == (5, 5, 5) {
        return Option::Some(('5,5,5', values, 10));
    }
    if values == (4, 4, 4) {
        return Option::Some(('4,4,4', values, 9));
    }
    if values == (3, 3, 3) {
        return Option::Some(('3,3,3', values, 8));
    }
    if values == (2, 2, 2) {
        return Option::Some(('2,2,2', values, 7));
    }
    if values == (1, 1, 1) {
        return Option::Some(('1,1,1', values, 6));
    }
    if values == (0, 0, 0) {
        return Option::Some(('0,0,0', values, 5));
    }

    match is_XXW(values) {
        Option::Some(v) => { return Option::Some(('2 of a kind', values, get_XX_payout(v))); },
        Option::None => {},
    }

    match is_XWX(values) {
        Option::Some(v) => { return Option::Some(('2 of a kind', values, get_XX_payout(v))); },
        Option::None => {},
    }

    match is_WXX(values) {
        Option::Some(v) => { return Option::Some(('2 of a kind', values, get_XX_payout(v))); },
        Option::None => {},
    }

    Option::None
}


#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct SlotMachine {
    #[key]
    pub game_id: u32,
    pub offset_r: u8,
    pub offset_y: u8,
    pub offset_o: u8,
    pub credits: u32,
}

// register external resource
// erc main node

#[generate_trait]
impl SlotMachineImpl of SlotMachineTrait {
    fn new(game_id: u32, credits: u32, seed: felt252) -> SlotMachine {
        let bits = BitsImpl::from_felt(seed);
        SlotMachine {
            game_id,
            offset_r: bits.extract_into::<u8>(0, 8) % SLOT_BY_ROLL,
            offset_y: bits.extract_into::<u8>(8, 8) % SLOT_BY_ROLL,
            offset_o: bits.extract_into::<u8>(16, 8) % SLOT_BY_ROLL,
            credits,
        }
    }


    fn roll(ref self: SlotMachine, seed: felt252) -> Option<(felt252, (u8, u8, u8), u32)> {
        assert(self.can_roll(), 'no credit no roll');

        // pay 1 credit
        self.credits -= 1;

        let bits = BitsImpl::from_felt(seed);

        let r = bits.extract_into::<u8>(0, 8) / 2;
        let y = bits.extract_into::<u8>(8, 8) / 2;
        let o = bits.extract_into::<u8>(16, 8) / 2;

        self.offset_r = (self.offset_r + r) % SLOT_BY_ROLL;
        self.offset_y = (self.offset_y + y) % SLOT_BY_ROLL;
        self.offset_o = (self.offset_o + o) % SLOT_BY_ROLL;

        let result = check_combinations(self.get_values());
        if let Option::Some((_, _, payout)) = result {
            // earn credits
            self.credits += payout;
        }

        result
    }

    fn can_roll(self: @SlotMachine) -> bool {
        *self.credits > 0
    }

    fn get_values(self: @SlotMachine) -> (u8, u8, u8) {
        (get_slot(0, *self.offset_r), get_slot(1, *self.offset_y), get_slot(2, *self.offset_o))
    }
}

#[starknet::interface]
trait ISlotMachine<T> {
    fn roll(ref self: T, token_id: u64);
}


#[dojo::contract]
mod slotmachine {
    use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};
    use dojo::world::IWorldDispatcherTrait;
    use game_components_minigame::interface::{IMinigameDispatcher, IMinigameDispatcherTrait};
    use game_components_minigame::libs::{assert_token_ownership, post_action, pre_action};
    use rollyourown::store::{Store, StoreImpl, StoreTrait};
    use starknet::{ContractAddress, get_caller_address};
    use super::{SlotMachine, SlotMachineImpl, SlotMachineTrait};

    // Event message

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    struct SlotMachineCombination {
        #[key]
        player_id: ContractAddress,
        name: felt252,
        values: (u8, u8, u8),
        payout: u32,
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _get_game_token_address(self: @ContractState) -> starknet::ContractAddress {
            let world = self.world(@"dopewars");
            let (game_token_systems_address, _) = world.dns(@"game_token_system_v0").unwrap();
            let minigame_dispatcher = IMinigameDispatcher {
                contract_address: game_token_systems_address,
            };
            minigame_dispatcher.token_address()
        }
    }

    #[abi(embed_v0)]
    impl SlotMachineImp of super::ISlotMachine<ContractState> {
        fn roll(ref self: ContractState, token_id: u64) {
            let token_address = self._get_game_token_address();
            assert_token_ownership(token_address, token_id);
            pre_action(token_address, token_id);

            let mut store = StoreImpl::new(self.world(@"dopewars"));
            let game = store.game_by_token_id(token_id);

            let ryo_addresses = store.ryo_addresses();
            let random = IVrfProviderDispatcher { contract_address: ryo_addresses.vrf }
                .consume_random(Source::Nonce(game.player_id));

            let mut machine = store.slot_machine(game.game_id);

            let _result = machine.roll(random);

            // if let Option::Some((name, values, payout)) = result {
            //     // emit!(
            //     //     self.world_dispatcher(),
            //     //     (Event::SlotMachineEvent(
            //     //         SlotMachineEvent { game_id, player_id, name, values, payout }
            //     //     ))
            //     // );
            //     // emit!(
            //     //     self.world_dispatcher(),
            //     //     (SlotMachineCombination { player_id, name, values, payout })
            //     // );
            // }

            store.set_slot_machine(@machine);

            // Update token state
            post_action(token_address, token_id);
        }
    }
}
