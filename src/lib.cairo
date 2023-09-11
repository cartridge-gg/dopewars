mod components;
mod systems;
mod constants;
mod utils;

#[cfg(test)]
mod tests;

#[derive(Copy, Drop, Serde, PartialEq)]
enum PlayerStatus {
    Normal: (),
    BeingMugged: (),
    BeingArrested: (),
}

impl StorageSizePlayerStatus of dojo::StorageSize<PlayerStatus> {
    #[inline(always)]
    fn unpacked_size() -> usize {
        1
    }

    #[inline(always)]
    fn packed_size() -> usize {
        2
    }
}

impl PlayerStatusPrintImpl of core::debug::PrintTrait<PlayerStatus> {
    fn print(self: PlayerStatus) {
        match self {
            PlayerStatus::Normal(()) => 0.print(),
            PlayerStatus::BeingMugged(()) => 1.print(),
            PlayerStatus::BeingArrested(()) => 2.print(),
        }
    }
}
