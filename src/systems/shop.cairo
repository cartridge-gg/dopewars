use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use rollyourown::models::player::{Player};
use rollyourown::models::item::{ItemEnum};

#[derive(Copy, Drop, Serde)]
struct AvailableItem {
    item_id: u32,
    item_type: felt252,
    name: felt252,
    level: u8,
    cost: u128,
    value: u128
}

#[starknet::interface]
trait IShop<TContractState> {
    fn is_open(self: @TContractState, player: Player) -> bool;
    fn buy_item(self: @TContractState, game_id: u32, item_id: ItemEnum);
    fn drop_item(self: @TContractState, game_id: u32, item_id: ItemEnum,);
    fn available_items(
        self: @TContractState, game_id: u32, player_id: ContractAddress
    ) -> Span<AvailableItem>;
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
    use rollyourown::constants::SCALING_FACTOR;

    use super::{IShop, AvailableItem};

     #[storage]
    struct Storage {
        world_dispatcher: IWorldDispatcher,
    }

  #[starknet::interface]
    trait ISystem<TContractState> {
        fn world(self: @TContractState) -> IWorldDispatcher;
    }

    impl ISystemImpl of ISystem<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
           self.world_dispatcher.read()
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

            assert(item.level <= shop_settings.max_item_level, 'item max level');
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

        #[view]
        fn available_items(
            self: @ContractState, game_id: u32, player_id: ContractAddress
        ) -> Span<AvailableItem> {
            let game = get!(self.world(), game_id, (Game));
            let player = get!(self.world(), (game_id, player_id), Player);

            self.assert_can_access_shop(@game, @player);

            let shop_settings = ShopSettingsImpl::get(
                game.game_mode, game.max_turns - player.turns_remaining
            );

            let mut available: Array<AvailableItem> = array![];

            let mut items = ItemTrait::all();

            loop {
                match items.pop_front() {
                    Option::Some(item_id) => {
                        let player_item = get!(
                            self.world(), (game_id, player_id, *item_id), (Item)
                        );

                        let item_settings = ItemSettingsImpl::get(
                            game.game_mode, *item_id, player_item.level + 1
                        );

                        if player_item.level <= shop_settings.max_item_level {
                            available
                                .append(
                                    AvailableItem {
                                        item_id:(*item_id).into(),
                                        item_type: (*item_id).into(),
                                        level: player_item.level + 1,
                                        name: item_settings.name,
                                        cost: item_settings.cost / SCALING_FACTOR,
                                        value: item_settings.value,
                                    }
                                );
                        };
                    },
                    Option::None => {
                        break;
                    },
                };
            };

            available.span()
        }
    }
}

