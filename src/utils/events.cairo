use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

trait RawEventEmitterTrait {
    fn emit_raw(self: IWorldDispatcher, selector: felt252, values: Array<felt252>);
}

impl RawEventEmitterImpl of RawEventEmitterTrait {
    fn emit_raw(self: IWorldDispatcher, selector: felt252, values: Array<felt252>) {
        let mut keys = array![selector];
        self.emit(keys, values.span());
    }
}

