use rollyourown::models::game::Game;
use rollyourown::models::player::Player;

use rollyourown::utils::settings::{ShopSettings, ShopSettingsImpl};

trait ShopTrait<T> {
    fn is_open(self: @T, player: @Player) -> bool;
}

impl ShopImpl of ShopTrait<ShopSettings> {
    fn is_open(self: @ShopSettings, player: @Player) -> bool {
        ((*player).turn % (*self).opening_freq) == 0
    }
}
