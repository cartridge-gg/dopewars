use rollyourown::utils::bits::{BitsImpl, BitsTrait};

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
        false => Option::None
    }
}

pub fn is_XWX(values: (u8, u8, u8)) -> Option<u8> {
    let (r, _, o) = values;
    match r == o {
        true => Option::Some(r),
        false => Option::None
    }
}

pub fn is_WXX(values: (u8, u8, u8)) -> Option<u8> {
    let (_, y, o) = values;
    match y == o {
        true => Option::Some(y),
        false => Option::None
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


pub fn check_combinations(values: (u8, u8, u8)) -> Option<(felt252, u32)> {
    if values == (7, 7, 7) {
        return Option::Some(('7,7,7', 50));
    }
    if values == (6, 6, 6) {
        return Option::Some(('6,6,6', 25));
    }
    if values == (5, 5, 5) {
        return Option::Some(('5,5,5', 10));
    }
    if values == (4, 4, 4) {
        return Option::Some(('4,4,4', 9));
    }
    if values == (3, 3, 3) {
        return Option::Some(('3,3,3', 8));
    }
    if values == (2, 2, 2) {
        return Option::Some(('2,2,2', 7));
    }
    if values == (1, 1, 1) {
        return Option::Some(('1,1,1', 6));
    }
    if values == (0, 0, 0) {
        return Option::Some(('0,0,0', 5));
    }

    match is_XXW(values) {
        Option::Some(v) => { return Option::Some(('X,X,W', get_XX_payout(v))); },
        Option::None => {}
    };

    match is_XWX(values) {
        Option::Some(v) => { return Option::Some(('X,W,X', get_XX_payout(v))); },
        Option::None => {}
    };
    match is_WXX(values) {
        Option::Some(v) => { return Option::Some(('W,X,X', get_XX_payout(v))); },
        Option::None => {}
    };

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
            credits
        }
    }


    fn roll(ref self: SlotMachine, seed: felt252) -> Option<(felt252, u32)> {
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
        if let Option::Some((_, payout)) = result {
            // earn credits
            self.credits += payout;
        };

        result
    }

    fn can_roll(self: @SlotMachine) -> bool {
        *self.credits > 0
    }

    fn get_values(self: @SlotMachine) -> (u8, u8, u8) {
        (get_slot(0, *self.offset_r), get_slot(1, *self.offset_y), get_slot(2, *self.offset_o))
    }

    fn cheat(ref self: SlotMachine) {
        self.credits += 10;
    }
}

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

#[starknet::interface]
trait ISlotMachine<T> {
    fn create(ref self: T, game_id: u32);
    fn roll(ref self: T, game_id: u32);
    fn cheat(ref self: T, game_id: u32);
}


#[dojo::contract]
mod slotmachine {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use rollyourown::{
        library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},
        utils::vrf_consumer::{VrfImpl, Source}
    };

    use super::{SlotMachine, SlotMachineImpl, SlotMachineTrait};


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        SlotMachineEvent: SlotMachineEvent,
    }

    #[derive(Drop, starknet::Event)]
    struct SlotMachineEvent {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        combi: felt252,
        payout: u32
    }

    #[abi(embed_v0)]
    impl SlotMachineImp of super::ISlotMachine<ContractState> {
        fn create(ref self: ContractState, game_id: u32) {
            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = VrfImpl::consume(ryo_addresses.vrf, Source::Nonce(player_id));

            let machine = SlotMachineImpl::new(game_id, 5, random);
            self.s().set_slot_machine(machine);
        }

        fn roll(ref self: ContractState, game_id: u32) {
            // TODO: checks

            let ryo_addresses = self.s().ryo_addresses();
            let player_id = get_caller_address();
            let random = VrfImpl::consume(ryo_addresses.vrf, Source::Nonce(player_id));

            let mut machine = self.s().slot_machine(game_id);

            let result = machine.roll(random);

            if let Option::Some((combi, payout)) = result {
                self.emit(SlotMachineEvent { game_id, player_id, combi, payout });
            }

            self.s().set_slot_machine(machine);
        }

        fn cheat(ref self: ContractState, game_id: u32) {
            let mut machine = self.s().slot_machine(game_id);
            machine.cheat();
            self.s().set_slot_machine(machine);
        }
    }

    #[generate_trait]
    impl SlotMachineInternalImpl of SlotMachineInternalTrait { // #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }
}