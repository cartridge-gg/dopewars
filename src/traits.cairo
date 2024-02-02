use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use rollyourown::utils::random::{Random, RandomImpl};

trait Enumerable<T> {
    fn all() -> Span<T>;
}

trait Randomizable<T> {
    fn random(ref randomizer: Random) -> T;
}


//

trait Packable<T, +Enumerable<T>> {
    #[inline(always)] // is it correct ? compiler dont complains
    fn bits(self: @T) -> u8;
    fn idx(self: @T) -> u8;
}

trait Packer<Unpacked, Packed> {
    fn pack(self: Unpacked) -> Packed;
}

trait Unpacker<Packed, Unpacked> {
    fn unpack(self: Packed, world: IWorldDispatcher, game_id: u32, player_id: ContractAddress) -> Unpacked;
}

 