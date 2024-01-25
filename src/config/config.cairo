use super::{items::{ItemConfig}, drugs::{Drugs}, locations::{Locations}};

#[derive(Copy, Drop, Serde)]
struct Config {
    drugs: Span<Drugs>,
    locations: Span<Locations>,
    items: Span<ItemConfig>,
}

#[starknet::interface]
trait IConfig<T> {
    fn get_config(self: @T) -> Config;
    fn get_drugs(self: @T) -> Span<Drugs>;
    fn get_locations(self: @T) -> Span<Locations>;
    fn get_items(self: @T) -> Span<ItemConfig>;
}


#[dojo::contract]
mod config {
    use super::Config;

    use super::super::{
        items::{
            ItemConfig, ItemConfigImpl, ItemSlot, ItemLevel, ItemSlotEnumerableImpl,
            ItemLevelEnumerableImpl
        },
        drugs::{Drugs, DrugsEnumerableImpl},
        locations::{Locations, LocationsEnumerableImpl}
    };

    #[abi(embed_v0)]
    impl ConfigImpl<ContractState> of super::IConfig<ContractState> {
        fn get_config(self: @ContractState) -> Config {
            Config {
                drugs:self.get_drugs(),
                locations:self.get_locations(),
                items:self.get_items(),
            }
        }


        fn get_drugs(self: @ContractState) -> Span<Drugs> {
            DrugsEnumerableImpl::all()
        }

        fn get_locations(self: @ContractState) -> Span<Locations> {
            LocationsEnumerableImpl::all()
        }
        
        fn get_items(self: @ContractState) -> Span<ItemConfig> {
            let mut slots = ItemSlotEnumerableImpl::all();
            let mut items = array![];

            loop {
                match slots.pop_front() {
                    Option::Some(slot) => {
                        let mut levels = ItemLevelEnumerableImpl::all();
                        loop {
                            match levels.pop_front() {
                                Option::Some(level) => {
                                    let config = ItemConfigImpl::get(*slot, *level);
                                    items.append(config);
                                },
                                Option::None => { break; }
                            }
                        };
                    },
                    Option::None => { break; }
                }
            };
            items.span()
        }
    }
}
