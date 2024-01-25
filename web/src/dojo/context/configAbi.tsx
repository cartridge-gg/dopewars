export const configAbi = [
  {
    type: "impl",
    name: "WorldProviderImpl",
    interface_name: "dojo::world::IWorldProvider",
  },
  {
    type: "struct",
    name: "dojo::world::IWorldDispatcher",
    members: [
      {
        name: "contract_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "interface",
    name: "dojo::world::IWorldProvider",
    items: [
      {
        type: "function",
        name: "world",
        inputs: [],
        outputs: [
          {
            type: "dojo::world::IWorldDispatcher",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "ConfigImpl",
    interface_name: "rollyourown::config::config::IConfig",
  },
  {
    type: "enum",
    name: "rollyourown::config::drugs::Drugs",
    variants: [
      {
        name: "Ludes",
        type: "()",
      },
      {
        name: "Speed",
        type: "()",
      },
      {
        name: "Weed",
        type: "()",
      },
      {
        name: "Acid",
        type: "()",
      },
      {
        name: "Heroin",
        type: "()",
      },
      {
        name: "Cocaine",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<rollyourown::config::drugs::Drugs>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<rollyourown::config::drugs::Drugs>",
      },
    ],
  },
  {
    type: "enum",
    name: "rollyourown::config::locations::Locations",
    variants: [
      {
        name: "Queens",
        type: "()",
      },
      {
        name: "Bronx",
        type: "()",
      },
      {
        name: "Brooklyn",
        type: "()",
      },
      {
        name: "Jersey",
        type: "()",
      },
      {
        name: "Central",
        type: "()",
      },
      {
        name: "Coney",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<rollyourown::config::locations::Locations>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<rollyourown::config::locations::Locations>",
      },
    ],
  },
  {
    type: "enum",
    name: "rollyourown::config::items::ItemSlot",
    variants: [
      {
        name: "Attack",
        type: "()",
      },
      {
        name: "Defense",
        type: "()",
      },
      {
        name: "Speed",
        type: "()",
      },
      {
        name: "Transport",
        type: "()",
      },
    ],
  },
  {
    type: "enum",
    name: "rollyourown::config::items::ItemLevel",
    variants: [
      {
        name: "Level0",
        type: "()",
      },
      {
        name: "Level1",
        type: "()",
      },
      {
        name: "Level2",
        type: "()",
      },
      {
        name: "Level3",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "rollyourown::config::items::ItemConfig",
    members: [
      {
        name: "name",
        type: "core::bytes_31::bytes31",
      },
      {
        name: "slot",
        type: "rollyourown::config::items::ItemSlot",
      },
      {
        name: "level",
        type: "rollyourown::config::items::ItemLevel",
      },
      {
        name: "stat",
        type: "core::integer::u8",
      },
      {
        name: "cost",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<rollyourown::config::items::ItemConfig>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<rollyourown::config::items::ItemConfig>",
      },
    ],
  },
  {
    type: "struct",
    name: "rollyourown::config::config::Config",
    members: [
      {
        name: "drugs",
        type: "core::array::Span::<rollyourown::config::drugs::Drugs>",
      },
      {
        name: "locations",
        type: "core::array::Span::<rollyourown::config::locations::Locations>",
      },
      {
        name: "items",
        type: "core::array::Span::<rollyourown::config::items::ItemConfig>",
      },
    ],
  },
  {
    type: "interface",
    name: "rollyourown::config::config::IConfig",
    items: [
      {
        type: "function",
        name: "get_config",
        inputs: [],
        outputs: [
          {
            type: "rollyourown::config::config::Config",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_drugs",
        inputs: [],
        outputs: [
          {
            type: "core::array::Span::<rollyourown::config::drugs::Drugs>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_locations",
        inputs: [],
        outputs: [
          {
            type: "core::array::Span::<rollyourown::config::locations::Locations>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_items",
        inputs: [],
        outputs: [
          {
            type: "core::array::Span::<rollyourown::config::items::ItemConfig>",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "UpgradableImpl",
    interface_name: "dojo::components::upgradeable::IUpgradeable",
  },
  {
    type: "interface",
    name: "dojo::components::upgradeable::IUpgradeable",
    items: [
      {
        type: "function",
        name: "upgrade",
        inputs: [
          {
            name: "new_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "function",
    name: "dojo_resource",
    inputs: [],
    outputs: [
      {
        type: "core::felt252",
      },
    ],
    state_mutability: "view",
  },
  {
    type: "event",
    name: "dojo::components::upgradeable::upgradeable::Upgraded",
    kind: "struct",
    members: [
      {
        name: "class_hash",
        type: "core::starknet::class_hash::ClassHash",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "dojo::components::upgradeable::upgradeable::Event",
    kind: "enum",
    variants: [
      {
        name: "Upgraded",
        type: "dojo::components::upgradeable::upgradeable::Upgraded",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "rollyourown::config::config::config::Event",
    kind: "enum",
    variants: [
      {
        name: "UpgradeableEvent",
        type: "dojo::components::upgradeable::upgradeable::Event",
        kind: "nested",
      },
    ],
  },
] as const;
