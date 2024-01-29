use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    game_mode: GameMode,
    max_turns: u8,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GameMode {
    Test,
    Unlimited
}

// use dojo::database::introspect::{
//     Enum, Member, Ty, Struct, Introspect, serialize_member, serialize_member_type
// };

// impl GameModeIntrospectionImpl of Introspect<GameMode> {
//     #[inline(always)]
//     fn size() -> usize {
//         1
//     }

//     #[inline(always)]
//     fn layout(ref layout: Array<u8>) {
//         layout.append(8);
//     }

//     #[inline(always)]
//     fn ty() -> Ty {
//         Ty::Enum(
//             Enum {
//                 name: 'GameMode',
//                 attrs: array![].span(),
//                 children: array![
//                     ('Limited', serialize_member_type(@Ty::Tuple(array![].span()))),
//                     ('Unlimited', serialize_member_type(@Ty::Tuple(array![].span()))),
//                 ]
//                     .span()
//             }
//         )
//     }
// }

