mod components;
mod systems;
mod constants;
mod events;
mod utils;

#[cfg(test)]
mod tests;

#[derive(Copy, Drop, Serde, PartialEq)]
enum PlayerState {
    Normal: (),
    BeingMugged: (),
    BeingArrested: (),
}

impl StorageSizePlayerState of dojo::StorageSize<PlayerState> {
    #[inline(always)]
    fn unpacked_size() -> usize {
        1
    }

    #[inline(always)]
    fn packed_size() -> usize {
        2
    }
}

impl PlayerStatePrintImpl of core::debug::PrintTrait<PlayerState> {
    fn print(self: PlayerState) {
        match self {
            PlayerState::Normal(()) => 0.print(),
            PlayerState::BeingMugged(()) => 1.print(),
            PlayerState::BeingArrested(()) => 2.print(),
        }
    }
}
