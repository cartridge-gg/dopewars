use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use debug::PrintTrait;

#[derive(Model, Copy, Drop, Serde)]
struct SortedList {
    #[key]
    list_id: felt252,
    size: u32,
    locked: bool,
    processed: bool,
    process_cursor_id: u32, // use keys when storage allows
    process_max_size: u32,  // max number of item to process
    process_size: u32,  // number of item processed
}

#[derive(Model, Copy, Drop, Serde)]
struct SortedListItem {
    #[key]
    list_id: felt252,
    #[key]
    item_id: u32,
    next_id: u32,
}

impl DisplaySortedListItem of PrintTrait<SortedListItem> {
    fn print(self: SortedListItem) {
        println!(
            "list_id: {} - item_id: {} - next_id: {} ", self.list_id, self.item_id, self.next_id,
        );
    }
}

#[derive(Model, Copy, Drop, Serde)]
struct Item {
    #[key]
    id: u32,
    // #[key]
    // second_key: u32,
    value: u32,
    position: u32,
}

trait SortableItem<T> {
    fn get_id(self: T) -> u32; // get_keys
    fn get_value(self: T) -> u32;
    fn get_by_id(world: IWorldDispatcher, id: u32) -> T; // get_by_keys
    fn get_position(self: T) -> u32;
    fn set_position(ref self: T, world: IWorldDispatcher, position: u32);
}


impl SortableItemImpl of SortableItem<Item> {
    fn get_id(self: Item) -> u32 {
        self.id
    }
    fn get_value(self: Item) -> u32 {
        self.value
    }
    fn get_by_id(world: IWorldDispatcher, id: u32) -> Item {
        get!(world, (id), Item)
    }
    fn get_position(self: Item) -> u32 {
        self.position
    }
    fn set_position(ref self: Item, world: IWorldDispatcher, position: u32) {
        self.position = position;
        set!(world, (self));
    }
}


#[generate_trait]
impl SortedListImpl of SortedListTrait {
    fn new(list_id: felt252) -> SortedList {
        // TODO check if exists
        SortedList {
            list_id,
            size: 0,
            locked: false,
            processed: false,
            process_cursor_id: SortedListImpl::root(),
            process_max_size: 0, 
            process_size: 0,
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
        ref self: SortedList, world: IWorldDispatcher, item: T, prev_item_id: u32,
    ) {
        assert(!self.locked, 'cannot add to locked list');

        let item = item;
        let item_id = item.get_id();
        let item_value = item.get_value();

        assert(item_id != SortedListImpl::root(), 'reserved root value');

        let prev_id = self.find_prev_id::<T>(world, item_value, prev_item_id);
        let mut prev = get!(world, (self.list_id, prev_id), (SortedListItem));

        // add new SortedListItem
        let sorted_item = SortedListItem {
            list_id: self.list_id, item_id, next_id: prev.next_id
        };
        set!(world, (sorted_item,));

        // update prev SortedListItem
        prev.next_id = item_id;
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
        let mut curr_item = SortableItem::<T>::get_by_id(world, curr.item_id);
        let mut next_item = SortableItem::<T>::get_by_id(world, next.item_id);

        if (curr.item_id == SortedListImpl::root() || curr_item.get_value() >= item_value)
            && (next.item_id == SortedListImpl::root() || next_item.get_value() < item_value) {
            true
        } else {
            false
        }
    }

    fn find_prev_id<T, +SortableItem<T>, +Drop<T>, +Copy<T>>(
        self: SortedList, world: IWorldDispatcher, item_value: u32, start_item_id: u32,
    ) -> u32 {
        let mut curr = get!(world, (self.list_id, start_item_id), (SortedListItem));

        loop {
            let mut next = get!(world, (self.list_id, curr.next_id), (SortedListItem));

            if self.is_correct_position::<T>(world, ref curr, ref next, item_value) {
                break curr.item_id;
            } else {
                curr = next;
            };
        }
    }

    //
    //
    //

    fn lock(ref self: SortedList, world: IWorldDispatcher) {
        assert(!self.locked, 'list already locked');

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
        assert(self.process_max_size > 0, 'invalid process_max_size');

        let curr_id = self.process_cursor_id;
        let mut curr = get!(world, (self.list_id, curr_id), (SortedListItem));
        let mut curr_item = SortableItem::<T>::get_by_id(world, curr.item_id);
        let mut curr_position = curr_item.get_position();

        let mut i = 0;

        loop {
   
            if curr.next_id == SortedListImpl::root() {
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

            curr = get!(world, (self.list_id, curr.next_id), (SortedListItem));
            curr_item = SortableItem::<T>::get_by_id(world, curr.item_id);
            curr_position += 1;
            curr_item.set_position(world, curr_position);

            self.process_size += 1;

            i += 1;
        };


        self.process_cursor_id = curr.item_id;

        self.set(world);

    }

    // fn get_position_by_id(self: SortedList, world: IWorldDispatcher, id: u32) -> u32 {
    //     let mut position = 1;
    //     let mut root = get!(world, (self.list_id, SortedListImpl::root()), (SortedListItem));
    //     let mut curr_id = root.next_id;

    //     loop {
    //         let mut curr = get!(world, (self.list_id, curr_id), (SortedListItem));
    //         let mut next = get!(world, (self.list_id, curr.next_id), (SortedListItem));

    //         if curr.item_id == id {
    //             break position;
    //         }
    //         if next.item_id != SortedListImpl::root() {
    //             curr_id = next.item_id;
    //             position += 1;
    //         } else {
    //             panic(array!['id not found']);
    //         }
    //     }
    // }

    //     fn remove<T, +SortableItem<T>, +Drop<T>, +Destruct<T>>(
    //         self: SortedList, world: IWorldDispatcher, list_id: u32, item: T
    //     ) {}


    fn print_all<T, +SortableItem<T>, +Copy<T>, +Drop<T>, +Destruct<T>>(
        self: SortedList, world: IWorldDispatcher,
    ) {
        let mut root = get!(world, (self.list_id, SortedListImpl::root()), (SortedListItem));
        let mut curr_id = root.next_id;

        loop {
            let mut curr = get!(world, (self.list_id, curr_id), (SortedListItem));

            let curr_item = SortableItem::<T>::get_by_id(world, curr.item_id);
            let curr_value = curr_item.get_value();
            let curr_position = curr_item.get_position();

            println!("{} - {} - {}", curr_id, curr_value, curr_position);

            if curr.next_id != SortedListImpl::root() {
                curr_id = curr.next_id;
            } else {
                break;
            }
        }
    }

    fn print(self: SortedList) {
        println!("------------");
        println!("list_id           : {}", self.list_id);
        println!("size              : {}", self.size);
        println!("locked            : {}", self.locked);
        println!("processed         : {}", self.processed);
        println!("process_cursor_id : {}", self.process_cursor_id);
        println!("process_max_size  : {}", self.process_max_size);
        println!("process_size      : {}", self.process_size);
    }
}
