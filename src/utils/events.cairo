use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

trait RawEventEmitterTrait {
    fn emit_raw(self: @IWorldDispatcher, keys: Array<felt252>, values: Array<felt252>);
}

impl RawEventEmitterImpl of RawEventEmitterTrait {
    fn emit_raw(
        self: @IWorldDispatcher, keys: Array<felt252>, values: Array<felt252>
    ) { // let mut keys = keys;
    // self.emit(keys, values.span());
    }
}

