use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::player::{Player};
use rollyourown::models::item::{ItemEnum};

#[starknet::interface]
trait IShop<TContractState> {
    fn is_open(self: @TContractState, player: Player) -> bool;
    fn buy_item(self: @TContractState, game_id: u32, item_id: ItemEnum);
    fn drop_item(self: @TContractState, game_id: u32, item_id: ItemEnum,);
}

#[starknet::contract]
mod shop {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use rollyourown::models::player::{Player, PlayerTrait};
    use rollyourown::models::location::Location;
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::item::{Item, ItemTrait, ItemEnum};
    use rollyourown::utils::settings::{
        ItemSettings, ItemSettingsImpl, ShopSettings, ShopSettingsImpl
    };

    use super::IShop;

    #[storage]
    struct Storage {
        world_dispatcher: ContractAddress,
    }

    #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            IWorldDispatcher { contract_address: self.world_dispatcher.read() }
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BoughtItem: BoughtItem,
        DroppedItem: DroppedItem
    }

    #[derive(Drop, starknet::Event)]
    struct BoughtItem {
        game_id: u32,
        player_id: ContractAddress,
        item_id: ItemEnum,
        level: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct DroppedItem {
        game_id: u32,
        player_id: ContractAddress,
        item_id: ItemEnum,
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_can_access_shop(self: @ContractState, game: @Game, player: @Player) {
            assert(self.is_open(*player), 'shop is closed!');
            assert((*game).tick(), 'cannot progress');
            assert((*player).can_continue(), 'player cannot shop');
        }
    }

    #[external(v0)]
    impl ShopImpl of IShop<ContractState> {
        fn is_open(self: @ContractState, player: Player) -> bool {
            // ( game.max_turns - player.turns_remaining ) % 5 ?
            //
            true
        }

        fn buy_item(self: @ContractState, game_id: u32, item_id: ItemEnum,) {
            let game = get!(self.world(), game_id, (Game));
            let player_id = get_caller_address();
            let mut player = get!(self.world(), (game_id, player_id), Player);

            self.assert_can_access_shop(@game, @player);

            let mut item = get!(self.world(), (game_id, player_id, item_id), Item);
            let shop_settings = ShopSettingsImpl::get(
                game.game_mode, game.max_turns - player.turns_remaining
            );

            assert(item.level < shop_settings.max_item_level, 'item max level');
            // TODO: check items shop_settings.max_item_allowed

            let item_settings = ItemSettingsImpl::get(
                game.game_mode, item_id, level: item.level + 1
            );

            assert(player.cash >= item_settings.cost, 'too poor');

            // pay item
            player.cash -= item_settings.cost;
            set!(self.world(), (player));

            // update item
            item.level += 1;
            set!(self.world(), (item));

            // emit event
            emit!(self.world(), BoughtItem { game_id, player_id, item_id, level: item.level });
        }

        fn drop_item(self: @ContractState, game_id: u32, item_id: ItemEnum,) {
            let game = get!(self.world(), game_id, (Game));
            let player_id = get_caller_address();
            let mut player = get!(self.world(), (game_id, player_id), Player);

            self.assert_can_access_shop(@game, @player);

            let mut item = get!(self.world(), (game_id, player_id, item_id), Item);
            assert(item.level > 0, '404 item not found');

            // update item
            item.level = 0;
            set!(self.world(), (item));

            // emit event
            emit!(self.world(), DroppedItem { game_id, player_id, item_id });
        }
    }
}

