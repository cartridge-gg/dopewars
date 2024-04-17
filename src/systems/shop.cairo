use starknet::ContractAddress;
use rollyourown::models::player::{Player};
use rollyourown::models::item::{ItemEnum};

#[derive(Copy, Drop, Serde)]
struct AvailableItem {
    item_id: u32,
    item_type: felt252,
    name: felt252,
    level: u8,
    cost: u128,
    value: usize
}

#[starknet::interface]
trait IShop<TContractState> {
    fn is_open(self: @TContractState, game_id: u32, player_id: ContractAddress) -> bool;
    fn skip(self: @TContractState, game_id: u32);
    fn buy_item(self: @TContractState, game_id: u32, item_id: ItemEnum);
    //fn drop_item(self: @TContractState, game_id: u32, item_id: ItemEnum,);
    fn available_items(
        self: @TContractState, game_id: u32, player_id: ContractAddress
    ) -> Span<AvailableItem>;
}

#[dojo::contract]
mod shop {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;

    use rollyourown::models::player::{Player, PlayerTrait, PlayerStatus};
    use rollyourown::models::location::{Location, LocationEnum};
    use rollyourown::models::game::{Game, GameTrait};
    use rollyourown::models::item::{Item, ItemTrait, ItemEnum};
    use rollyourown::utils::settings::{
        ItemSettings, ItemSettingsImpl, ShopSettings, ShopSettingsImpl
    };
    use rollyourown::utils::shop::{ShopImpl, ShopTrait};
    use rollyourown::utils::random::{RandomImpl};
    use rollyourown::systems::travel::on_turn_end;

    use super::{IShop, AvailableItem};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BoughtItem: BoughtItem,
        DroppedItem: DroppedItem
    }

    #[derive(Drop, starknet::Event)]
    struct BoughtItem {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        item_id: ItemEnum,
        level: u8,
        cost: u32
    }

    #[derive(Drop, starknet::Event)]
    struct DroppedItem {
        #[key]
        game_id: u32,
        #[key]
        player_id: ContractAddress,
        item_id: ItemEnum,
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_can_access_shop(self: @ContractState, game: @Game, player: @Player) {
            assert(self.is_open((*game).game_id, (*player).player_id), 'shop is closed!');
            assert((*player).status == PlayerStatus::AtPawnshop, 'not at shop!');
            assert((*game).tick(), 'cannot progress');
        }
    }

    #[external(v0)]
    impl ShopExternalImpl of IShop<ContractState> {
        fn skip(self: @ContractState, game_id: u32) {
            let world = self.world();
            let player_id = get_caller_address();
            let game = get!(world, game_id, (Game));
            let mut player = get!(world, (game_id, player_id), Player);
            let mut randomizer = RandomImpl::new(world);

            assert(player.status == PlayerStatus::AtPawnshop, 'not at pawnshop !');
            assert(self.is_open(game_id, player_id), 'pawnshop not open !');

            on_turn_end(world, ref randomizer, @game, ref player);
        }


        fn is_open(self: @ContractState, game_id: u32, player_id: ContractAddress) -> bool {
            let world = self.world();
            let game = get!(world, game_id, (Game));
            let player = get!(world, (game_id, player_id), Player);
            let shop_settings = ShopSettingsImpl::get(game.game_mode);

            shop_settings.is_open(@player)
        }

        fn buy_item(self: @ContractState, game_id: u32, item_id: ItemEnum,) {
            let world = self.world();
            let game = get!(world, game_id, (Game));
            let player_id = get_caller_address();
            let mut player = get!(world, (game_id, player_id), Player);
            let mut randomizer = RandomImpl::new(world);

            self.assert_can_access_shop(@game, @player);

            let mut item = get!(world, (game_id, player_id, item_id), Item);
            let shop_settings = ShopSettingsImpl::get(game.game_mode);

            assert(item.level < shop_settings.max_item_level, 'item max level');

            // buyin a new item, not upgrading
            if item.level == 0 {
                assert(
                    player.get_item_count(world) < shop_settings.max_item_allowed, 'max item count'
                )
            }

            let item_settings = ItemSettingsImpl::get(
                game.game_mode, item_id, level: item.level + 1
            );

            assert(player.cash >= item_settings.cost, 'too poor');

            // pay item
            player.cash -= item_settings.cost;

            // update item
            item.level += 1;
            item.name = item_settings.name;
            item.value = item_settings.value;
            set!(world, (item));

            // emit event
            emit!(
                self.world(),
                BoughtItem {
                    game_id,
                    player_id,
                    item_id,
                    level: item.level,
                    cost: (item_settings.cost / game.scaling_factor).try_into().unwrap()
                }
            );

            on_turn_end(world, ref randomizer, @game, ref player);
        }

        // fn drop_item(self: @ContractState, game_id: u32, item_id: ItemEnum,) {
        //     let world = self.world();
        //     let game = get!(world, game_id, (Game));
        //     let player_id = get_caller_address();
        //     let mut player = get!(world, (game_id, player_id), Player);

        //     self.assert_can_access_shop(@game, @player);

        //     let mut item = get!(world, (game_id, player_id, item_id), Item);
        //     assert(item.level > 0, '404 item not found');

        //     // update item
        //     item.level = 0;
        //     item.name = '';
        //     item.value = 0;
        //     set!(world, (item));

        //     on_turn_end(world, @game, ref player);
        //     set!(world, (player));

        //     // emit event
        //     emit!(world, DroppedItem { game_id, player_id, item_id });
        // }

        fn available_items(
            self: @ContractState, game_id: u32, player_id: ContractAddress
        ) -> Span<AvailableItem> {
            let world = self.world();
            let game = get!(world, game_id, (Game));
            let player = get!(world, (game_id, player_id), Player);

            let mut available: Array<AvailableItem> = array![];

            if !self.is_open(game_id, player_id) {
                return available.span();
            };

            let shop_settings = ShopSettingsImpl::get(game.game_mode);
            let mut items = ItemTrait::all();

            loop {
                match items.pop_front() {
                    Option::Some(item_id) => {
                        let player_item = get!(world, (game_id, player_id, *item_id), (Item));

                        let item_settings = ItemSettingsImpl::get(
                            game.game_mode, *item_id, player_item.level + 1
                        );

                        if player_item.level < shop_settings.max_item_level {
                            available
                                .append(
                                    AvailableItem {
                                        item_id: (*item_id).into(),
                                        item_type: (*item_id).into(),
                                        level: player_item.level + 1,
                                        name: item_settings.name,
                                        cost: item_settings.cost / game.scaling_factor,
                                        value: item_settings.value,
                                    }
                                );
                        };
                    },
                    Option::None => { break; },
                };
            };

            available.span()
        }
    }
}

