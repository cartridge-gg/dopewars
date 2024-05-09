use core::traits::TryInto;
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use debug::PrintTrait;

use rollyourown::{
    models::{game::Game, season::Season},
    utils::payout_structure::{get_payout}
};


#[derive(Model, Copy, Drop, Serde)]
struct SortedList {
    #[key]
    list_id: felt252,
    size: u32,
    locked: bool,
    processed: bool,
    process_max_size: u32, // max number of item to process
    process_size: u32, // number of item processed
    process_cursor_k0: u32,
    process_cursor_k1: ContractAddress,
}

#[derive(Model, Copy, Drop, Serde)]
struct SortedListItem {
    #[key]
    list_id: felt252,
    #[key]
    item_k0: u32,
    #[key]
    item_k1: ContractAddress,
    //  
    next_k0: u32,
    next_k1: ContractAddress,
}

impl DisplaySortedListItem of PrintTrait<SortedListItem> {
    fn print(self: SortedListItem) {
        println!(
            "DisplaySortedListItem : TODO" // "list_id: {} - item_id: {} - next_id: {} ", self.list_id, self.item_id, self.next_id,
        );
    }
}


trait SortableItem<T> {
    fn get_keys(self: T) -> (u32, ContractAddress);
    fn get_value(self: T) -> u32;
    fn get_by_keys(world: IWorldDispatcher, keys: (u32, ContractAddress)) -> T;
    // fn get_position(self: T) -> u16;
    fn set_position(ref self: T, world: IWorldDispatcher, position: u16, entrants: u32, paper_balance: u32);
}


impl SortableItemGameImpl of SortableItem<Game> {
    fn get_keys(self: Game) -> (u32, ContractAddress) {
        (self.game_id, self.player_id)
    }
    fn get_value(self: Game) -> u32 {
        self.final_score
    }
    fn get_by_keys(world: IWorldDispatcher, keys: (u32, ContractAddress)) -> Game {
        get!(world, keys, Game)
    }
    // fn get_position(self: Game) -> u16 {
    //     self.position
    // }
    fn set_position(ref self: Game, world: IWorldDispatcher, position: u16, entrants: u32, paper_balance: u32) {
        // calc payout for this game
        let payout = get_payout(position.into(), entrants, paper_balance);
        self.position = position;
        self.claimable = payout;
        set!(world, (self));
    }
}


#[generate_trait]
impl SortedListImpl of SortedListTrait {
    fn new(list_id: felt252) -> SortedList {
        // TODO check if exists ?
        SortedList {
            list_id,
            size: 0,
            locked: false,
            processed: false,
            process_max_size: 0,
            process_size: 0,
            process_cursor_k0: SortedListImpl::root(),
            process_cursor_k1: Into::<u32, felt252>::into(SortedListImpl::root())
                .try_into()
                .unwrap(),
        }
    }

    #[inline(always)]
    fn root() -> u32 {
        0
    }

    fn get(world: IWorldDispatcher, list_id: felt252) -> SortedList {
        get!(world, (list_id), (SortedList))
    }

    fn set(self: SortedList, world: IWorldDispatcher) {
        set!(world, (self))
    }

    //
    //
    //

    fn add<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        ref self: SortedList,
        world: IWorldDispatcher,
        item: T,
        prev_item_keys: (u32, ContractAddress),
    ) {
        assert(!self.locked, 'cannot add to locked list');

        let item = item;
        let (item_k0, item_k1) = item.get_keys();
        let item_value = item.get_value();

        assert(
            item_k0 != SortedListImpl::root() && Zeroable::is_non_zero(item_k1),
            'reserved root value'
        );

        let (prev_k0, prev_k1) = self.find_prev_keys::<T>(world, item_value, prev_item_keys);
        let mut prev = get!(world, (self.list_id, prev_k0, prev_k1), (SortedListItem));

        // add new SortedListItem
        let sorted_item = SortedListItem {
            list_id: self.list_id,
            item_k0: item_k0,
            item_k1: item_k1,
            next_k0: prev.next_k0,
            next_k1: prev.next_k1,
        };
        set!(world, (sorted_item,));

        // update prev SortedListItem
        prev.next_k0 = item_k0;
        prev.next_k1 = item_k1;
        set!(world, (prev));

        // update SortedList
        self.size += 1;
        self.set(world);
    }


    fn is_correct_position<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        self: SortedList,
        world: IWorldDispatcher,
        ref curr: SortedListItem,
        ref next: SortedListItem,
        item_value: u32,
    ) -> bool {
        let mut curr_item = SortableItem::<T>::get_by_keys(world, (curr.item_k0, curr.item_k1));
        let mut next_item = SortableItem::<T>::get_by_keys(world, (next.item_k0, next.item_k1));

        if ((curr.item_k0 == SortedListImpl::root() && Zeroable::is_zero(curr.item_k1))
            || curr_item.get_value() >= item_value)
            && ((next.item_k0 == SortedListImpl::root() && Zeroable::is_zero(next.item_k1))
                || next_item.get_value() < item_value) {
            true
        } else {
            false
        }
    }

    fn find_prev_keys<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        self: SortedList,
        world: IWorldDispatcher,
        item_value: u32,
        start_item_keys: (u32, ContractAddress),
    ) -> (u32, ContractAddress) {
        let (start_item_k0, start_item_k1) = start_item_keys;   
        let mut curr = get!(world, (self.list_id, start_item_k0, start_item_k1), (SortedListItem));
 
        loop {
            let mut next = get!(
                world, (self.list_id, curr.next_k0, curr.next_k1), (SortedListItem)
            );

            if self.is_correct_position::<T>(world, ref curr, ref next, item_value) {
                break (curr.item_k0, curr.item_k1);
            } else {
                curr = next;
            };
        }
    }

    //
    //
    //

    fn lock(ref self: SortedList, world: IWorldDispatcher, process_max_size: u32) {
        assert(!self.locked, 'list already locked');
        assert( process_max_size > 0, 'invalid process_max_size');

        self.process_max_size = process_max_size;
        self.locked = true;
        self.set(world);
    }

    //
    //
    //

    fn process<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        ref self: SortedList, world: IWorldDispatcher, batch_size: u8
    ) {
        assert(self.locked, 'list must be locked');
        assert(!self.processed, 'list already processed');
        assert(batch_size > 0, 'invalid batch_size');

        let season = get!(world, (self.list_id), (Season));
        let paper_balance = season.paper_balance;
        let entrants = self.size;
       
        let curr_k0 = self.process_cursor_k0;
        let curr_k1 = self.process_cursor_k1;

        let mut curr = get!(world, (self.list_id, curr_k0, curr_k1), (SortedListItem));
        let mut curr_item = SortableItem::<T>::get_by_keys(world, (curr.item_k0, curr.item_k1));
        let mut curr_position: u16 = self.process_size.try_into().unwrap();//curr_item.get_position();

        let mut i = 0;

        loop {
            if curr.next_k0 == SortedListImpl::root() && Zeroable::is_zero(curr.next_k1) {
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

            curr = get!(world, (self.list_id, curr.next_k0, curr.next_k1), (SortedListItem));
            curr_item = SortableItem::<T>::get_by_keys(world, (curr.item_k0, curr.item_k1));
            curr_position += 1;
            curr_item.set_position(world, curr_position, entrants, paper_balance);

            self.process_size += 1;

            i += 1;
        };

        self.process_cursor_k0 = curr.item_k0;
        self.process_cursor_k1 = curr.item_k1;

        self.set(world);
    }

    // fn print_all<T, +SortableItem<T>, +Copy<T>, +Drop<T>, +Destruct<T>>(
    //     self: SortedList, world: IWorldDispatcher,
    // ) {
    //     let mut root = get!(world, (self.list_id, SortedListImpl::root()), (SortedListItem));
    //     let mut curr_id = root.next_id;

    //     loop {
    //         let mut curr = get!(world, (self.list_id, curr_id), (SortedListItem));

    //         let curr_item = SortableItem::<T>::get_by_id(world, curr.item_id);
    //         let curr_value = curr_item.get_value();
    //         let curr_position = curr_item.get_position();

    //         println!("{} - {} - {}", curr_id, curr_value, curr_position);

    //         if curr.next_id != SortedListImpl::root() {
    //             curr_id = curr.next_id;
    //         } else {
    //             break;
    //         }
    //     }
    // }

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
