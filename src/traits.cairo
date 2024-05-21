use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use rollyourown::{
    utils::random::{Random, RandomImpl}, models::game::{Game},
    library::{store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},},
};

trait Enumerable<T> {
    fn all() -> Span<T>;
}

trait Randomizable<T> {
    fn random(ref randomizer: Random) -> T;
}

impl RandomizableImpl<T, +Copy<T>, +Enumerable<T>> of Randomizable<T> {
    fn random(ref randomizer: Random) -> T {
        let items = Enumerable::<T>::all();
        let index = randomizer.between::<u32>(0, items.len().into());
        *items.at(index.try_into().unwrap())
    }
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

// trait Unpacker<Packed, Unpacked> {
//     fn unpack(self: Packed, s: IStoreLibraryDispatcher, game: Game) -> Unpacked;
// }

