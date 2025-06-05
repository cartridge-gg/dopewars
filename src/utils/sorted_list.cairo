use core::num::traits::Zero;
use core::traits::TryInto;

use rollyourown::{
    models::{game::Game}, store::{Store, StoreImpl, StoreTrait},
    utils::payout_structure::{get_payout},
};
use starknet::ContractAddress;


#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct SortedList {
    #[key]
    pub list_id: felt252,
    pub size: u32,
    pub locked: bool,
    pub processed: bool,
    pub process_max_size: u32, // max number of item to process
    pub process_size: u32, // number of item processed
    pub process_cursor_k0: u32,
    pub process_cursor_k1: ContractAddress,
    pub stake_adj_paper_balance: u32,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct SortedListItem {
    #[key]
    pub list_id: felt252,
    #[key]
    pub item_k0: u32,
    #[key]
    pub item_k1: ContractAddress,
    //
    pub next_k0: u32,
    pub next_k1: ContractAddress,
}


pub trait SortableItem<T> {
    fn get_keys(self: T) -> (u32, ContractAddress);
    fn get_value(self: T) -> u32;
    fn get_by_keys(store: @Store, keys: (u32, ContractAddress)) -> T;
    // fn get_position(self: T) -> u16;
    fn set_position(
        ref self: T,
        ref store: Store,
        position: u16,
        entrants: u32,
        paper_balance: u32,
        stake_adj_paper_balance: u32,
    );
    fn get_multiplier(self: T) -> u32;
}


pub impl SortableItemGameImpl of SortableItem<Game> {
    fn get_keys(self: Game) -> (u32, ContractAddress) {
        (self.game_id, self.player_id)
    }
    fn get_value(self: Game) -> u32 {
        self.final_score
    }
    fn get_multiplier(self: Game) -> u32 {
        self.multiplier.into()
    }
    fn get_by_keys(store: @Store, keys: (u32, ContractAddress)) -> Game {
        // get!(world, keys, Game)
        let (game_id, player_id) = keys;
        store.game(game_id, player_id)
    }

    fn set_position(
        ref self: Game,
        ref store: Store,
        position: u16,
        entrants: u32,
        paper_balance: u32,
        stake_adj_paper_balance: u32,
    ) {
        // calc payout for this game
        let payout = get_payout(position.into(), entrants, paper_balance, false);
        // adjust with multipliers
        let claimable: u64 = if stake_adj_paper_balance > 0 {
            payout.into()
                * self.multiplier.into()
                * paper_balance.into()
                / stake_adj_paper_balance.into()
        } else {
            0
        };

        self.position = position;
        self.claimable = claimable.try_into().unwrap();
        // set!(world, (self));
        store.set_game(@self)
    }
}


#[generate_trait]
pub impl SortedListImpl of SortedListTrait {
    fn new(list_id: felt252) -> SortedList {
        // TODO check if exists ?
        SortedList {
            list_id,
            size: 0,
            locked: false,
            processed: false,
            process_max_size: 0,
            process_size: 0,
            process_cursor_k0: Self::root(),
            process_cursor_k1: Into::<u32, felt252>::into(Self::root()).try_into().unwrap(),
            stake_adj_paper_balance: 0,
        }
    }

    #[inline(always)]
    fn root() -> u32 {
        0
    }

    fn get(store: @Store, list_id: felt252) -> SortedList {
        // get!(world, (list_id), (SortedList))
        store.sorted_list(list_id)
    }

    fn set(self: SortedList, ref store: Store) {
        store.set_sorted_list(@self)
    }

    //
    //
    //

    fn add<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        ref self: SortedList, ref store: Store, item: T, prev_item_keys: (u32, ContractAddress),
    ) {
        assert(!self.locked, 'cannot add to locked list');

        let item = item;
        let (item_k0, item_k1) = item.get_keys();
        let item_value = item.get_value();

        assert(item_k0 != Self::root() && item_k1.is_non_zero(), 'reserved root value');

        let (prev_k0, prev_k1) = self.find_prev_keys::<T>(ref store, item_value, prev_item_keys);
        // let mut prev = get!(world, (self.list_id, prev_k0, prev_k1), (SortedListItem));
        let mut prev: SortedListItem = store.sorted_list_item(self.list_id, prev_k0, prev_k1);

        // add new SortedListItem
        let sorted_item = SortedListItem {
            list_id: self.list_id,
            item_k0: item_k0,
            item_k1: item_k1,
            next_k0: prev.next_k0,
            next_k1: prev.next_k1,
        };
        // set!(world, (sorted_item,));
        store.set_sorted_list_item(@sorted_item);

        // update prev SortedListItem
        prev.next_k0 = item_k0;
        prev.next_k1 = item_k1;
        //set!(world, (prev));
        store.set_sorted_list_item(@prev);

        // update SortedList
        self.size += 1;
        //self.set(world);
        Self::set(self, ref store);
    }


    fn is_correct_position<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        self: SortedList,
        ref store: Store,
        ref curr: SortedListItem,
        ref next: SortedListItem,
        item_value: u32,
    ) -> bool {
        let mut curr_item = SortableItem::<T>::get_by_keys(@store, (curr.item_k0, curr.item_k1));
        let mut next_item = SortableItem::<T>::get_by_keys(@store, (next.item_k0, next.item_k1));

        if ((curr.item_k0 == Self::root() && curr.item_k1.is_zero())
            || curr_item.get_value() >= item_value)
            && ((next.item_k0 == Self::root() && next.item_k1.is_zero())
                || next_item.get_value() < item_value) {
            true
        } else {
            false
        }
    }

    fn find_prev_keys<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        self: SortedList,
        ref store: Store,
        item_value: u32,
        start_item_keys: (u32, ContractAddress),
    ) -> (u32, ContractAddress) {
        let (start_item_k0, start_item_k1) = start_item_keys;
        let mut curr = store.sorted_list_item(self.list_id, start_item_k0, start_item_k1);

        loop {
            let mut next: SortedListItem = store
                .sorted_list_item(self.list_id, curr.next_k0, curr.next_k1);

            if self.is_correct_position::<T>(ref store, ref curr, ref next, item_value) {
                break (curr.item_k0, curr.item_k1);
            } else {
                curr = next;
            };
        }
    }

    //
    //
    //

    fn lock(
        ref self: SortedList, ref store: Store, process_max_size: u32, stake_adj_paper_balance: u32,
    ) {
        assert(!self.locked, 'list already locked');
        assert(process_max_size > 0, 'invalid process_max_size');

        self.process_max_size = process_max_size;
        self.stake_adj_paper_balance = stake_adj_paper_balance;
        self.locked = true;
        //self.set(world);
        Self::set(self, ref store);
    }

    //
    //
    //

    fn process<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        ref self: SortedList, ref store: Store, batch_size: u8,
    ) {
        assert(self.locked, 'list must be locked');
        assert(!self.processed, 'list already processed');
        assert(batch_size > 0, 'invalid batch_size');

        let season = store.season(self.list_id.try_into().unwrap());
        let paper_balance = season.paper_balance;
        let entrants = self.size;
        let stake_adj_paper_balance = self.stake_adj_paper_balance;

        let curr_k0 = self.process_cursor_k0;
        let curr_k1 = self.process_cursor_k1;

        let mut curr = store.sorted_list_item(self.list_id, curr_k0, curr_k1);
        let mut curr_item = SortableItem::<T>::get_by_keys(@store, (curr.item_k0, curr.item_k1));
        let mut curr_position: u16 = self
            .process_size
            .try_into()
            .unwrap(); //curr_item.get_position();

        let mut i = 0;

        loop {
            if curr.next_k0 == Self::root() && curr.next_k1.is_zero() {
                self.processed = true;
                break;
            }

            if self.process_size == self.process_max_size {
                self.processed = true;
                break;
            }

            if i == batch_size {
                break;
            }

            curr = store.sorted_list_item(self.list_id, curr.next_k0, curr.next_k1);
            curr_item = SortableItem::<T>::get_by_keys(@store, (curr.item_k0, curr.item_k1));
            curr_position += 1;
            curr_item
                .set_position(
                    ref store, curr_position, entrants, paper_balance, stake_adj_paper_balance,
                );

            self.process_size += 1;

            i += 1;
        };

        self.process_cursor_k0 = curr.item_k0;
        self.process_cursor_k1 = curr.item_k1;

        // self.set(world);
        Self::set(self, ref store);
    }

    //

    fn calc_stake_adj_paper_balance<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        ref self: SortedList, ref store: Store, total_payed: u32,
    ) -> u32 {
        let entrants = self.size;
        let season = store.season(self.list_id.try_into().unwrap());
        let paper_balance = season.paper_balance;

        let curr_k0 = Self::root();
        let curr_k1 = Into::<u32, felt252>::into(Self::root()).try_into().unwrap();

        let mut curr = store.sorted_list_item(self.list_id, curr_k0, curr_k1);
        let mut curr_item = SortableItem::<T>::get_by_keys(@store, (curr.item_k0, curr.item_k1));
        let mut stake_adj_paper_balance: u32 = 0;

        let mut i = 0;

        while i < total_payed {
            curr = store.sorted_list_item(self.list_id, curr.next_k0, curr.next_k1);
            curr_item = SortableItem::<T>::get_by_keys(@store, (curr.item_k0, curr.item_k1));

            // to adjust payout we will divide by stake_adj_paper_balance so we round it up
            let payout = get_payout((i + 1).into(), entrants, paper_balance, true);
            stake_adj_paper_balance += payout * curr_item.get_multiplier();

            // println!(
            //     "{} - {} - {} - {}", i, payout, curr_item.get_multiplier(),
            //     stake_adj_paper_balance,
            // );

            i += 1;
        };

        stake_adj_paper_balance
    }

    fn print(self: SortedList) {
        println!("------------");
        println!("list_id           : {}", self.list_id);
        println!("size              : {}", self.size);
        println!("locked            : {}", self.locked);
        println!("processed         : {}", self.processed);
        println!("process_max_size  : {}", self.process_max_size);
        println!("process_size      : {}", self.process_size);
        println!("process_cursor_k0 : {}", self.process_cursor_k0);
        // println!("process_cursor_k1 : {}", self.process_cursor_k1);
    }
}
