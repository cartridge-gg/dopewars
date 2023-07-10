use array::{ArrayTrait, SpanTrait};
use traits::{Into, TryInto};

#[derive(Component, Copy, Drop, Serde)]
struct Drug {
    quantity: usize, 
}

trait DrugTrait {
    fn all() -> Span<felt252>;
}

impl DrugImpl of DrugTrait {
    fn all() -> Span<felt252> {
        let mut drugs = array::ArrayTrait::new();
        drugs.append('Acid'.into());
        drugs.append('Weed'.into());
        drugs.append('Ludes'.into());
        drugs.append('Speed'.into());
        drugs.append('Heroin'.into());
        drugs.append('Cocaine'.into());

        drugs.span()
    }
}
