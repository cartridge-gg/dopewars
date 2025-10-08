use rollyourown::config::hustlers::ItemSlot;
use rollyourown::libraries::dopewars_items::ItemTierConfig;

#[derive(Clone, Drop, Serde)]
pub struct GearItemConfig {
    pub slot: ItemSlot,
    pub item_id: u8,
    pub level: u8,
    pub levels: Span<ItemTierConfig>,
}

#[generate_trait]
pub impl GearItemConfigImpl of GearItemConfigTrait {
    fn level_config(self: @GearItemConfig) -> @ItemTierConfig {
        (*self.levels).at((*self.level).into())
    }
    fn next_level_config(self: @GearItemConfig) -> @ItemTierConfig {
        (*self.levels).at((*self.level).into() + 1)
    }
}
