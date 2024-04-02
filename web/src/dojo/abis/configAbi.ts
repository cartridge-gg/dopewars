export const ABI = [
  {
    "type": "impl",
    "name": "DojoResourceProviderImpl",
    "interface_name": "dojo::world::IDojoResourceProvider"
  },
  {
    "type": "interface",
    "name": "dojo::world::IDojoResourceProvider",
    "items": [
      {
        "type": "function",
        "name": "dojo_resource",
        "inputs": [],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "WorldProviderImpl",
    "interface_name": "dojo::world::IWorldProvider"
  },
  {
    "type": "struct",
    "name": "dojo::world::IWorldDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "interface",
    "name": "dojo::world::IWorldProvider",
    "items": [
      {
        "type": "function",
        "name": "world",
        "inputs": [],
        "outputs": [
          {
            "type": "dojo::world::IWorldDispatcher"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ConfigImpl",
    "interface_name": "rollyourown::config::config::IConfig"
  },
  {
    "type": "struct",
    "name": "rollyourown::config::config::LayoutItem",
    "members": [
      {
        "name": "name",
        "type": "core::bytes_31::bytes31"
      },
      {
        "name": "idx",
        "type": "core::integer::u8"
      },
      {
        "name": "bits",
        "type": "core::integer::u8"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::config::LayoutsConfig",
    "members": [
      {
        "name": "game_store",
        "type": "core::array::Array::<rollyourown::config::config::LayoutItem>"
      },
      {
        "name": "player",
        "type": "core::array::Array::<rollyourown::config::config::LayoutItem>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::hustlers::ItemSlot",
    "variants": [
      {
        "name": "Weapon",
        "type": "()"
      },
      {
        "name": "Clothes",
        "type": "()"
      },
      {
        "name": "Feet",
        "type": "()"
      },
      {
        "name": "Transport",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::hustlers::HustlerItemBaseConfig",
    "members": [
      {
        "name": "slot",
        "type": "rollyourown::config::hustlers::ItemSlot"
      },
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "slot_id",
        "type": "core::integer::u8"
      },
      {
        "name": "name",
        "type": "core::bytes_31::bytes31"
      },
      {
        "name": "initial_tier",
        "type": "core::integer::u8"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::hustlers::HustlerItemTiersConfig",
    "members": [
      {
        "name": "slot",
        "type": "rollyourown::config::hustlers::ItemSlot"
      },
      {
        "name": "tier",
        "type": "core::integer::u8"
      },
      {
        "name": "slot_id",
        "type": "core::integer::u8"
      },
      {
        "name": "cost",
        "type": "core::integer::u32"
      },
      {
        "name": "stat",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::hustlers::HustlerItemConfig",
    "members": [
      {
        "name": "slot",
        "type": "rollyourown::config::hustlers::ItemSlot"
      },
      {
        "name": "level",
        "type": "core::integer::u8"
      },
      {
        "name": "base",
        "type": "rollyourown::config::hustlers::HustlerItemBaseConfig"
      },
      {
        "name": "tier",
        "type": "rollyourown::config::hustlers::HustlerItemTiersConfig"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::hustlers::HustlerConfig",
    "members": [
      {
        "name": "hustler_id",
        "type": "core::integer::u16"
      },
      {
        "name": "weapon",
        "type": "rollyourown::config::hustlers::HustlerItemConfig"
      },
      {
        "name": "clothes",
        "type": "rollyourown::config::hustlers::HustlerItemConfig"
      },
      {
        "name": "feet",
        "type": "rollyourown::config::hustlers::HustlerItemConfig"
      },
      {
        "name": "transport",
        "type": "rollyourown::config::hustlers::HustlerItemConfig"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::game::GameConfig",
    "members": [
      {
        "name": "key",
        "type": "core::integer::u8"
      },
      {
        "name": "cash",
        "type": "core::integer::u32"
      },
      {
        "name": "health",
        "type": "core::integer::u8"
      },
      {
        "name": "max_turns",
        "type": "core::integer::u8"
      },
      {
        "name": "max_wanted_shopping",
        "type": "core::integer::u8"
      },
      {
        "name": "max_rounds",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_drug_step",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_buy_item",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_carry_drugs",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_pay_cops",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_pay_gang",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_run_cops",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_run_gang",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_fight_cops",
        "type": "core::integer::u8"
      },
      {
        "name": "rep_fight_gang",
        "type": "core::integer::u8"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::config::Config",
    "members": [
      {
        "name": "layouts",
        "type": "rollyourown::config::config::LayoutsConfig"
      },
      {
        "name": "hustlers",
        "type": "core::array::Array::<rollyourown::config::hustlers::HustlerConfig>"
      },
      {
        "name": "game_config",
        "type": "rollyourown::config::game::GameConfig"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::drugs::Drugs",
    "variants": [
      {
        "name": "Ludes",
        "type": "()"
      },
      {
        "name": "Speed",
        "type": "()"
      },
      {
        "name": "Weed",
        "type": "()"
      },
      {
        "name": "Shrooms",
        "type": "()"
      },
      {
        "name": "Acid",
        "type": "()"
      },
      {
        "name": "Ketamine",
        "type": "()"
      },
      {
        "name": "Heroin",
        "type": "()"
      },
      {
        "name": "Cocaine",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::utils::bytes16::Bytes16",
    "members": [
      {
        "name": "value",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::drugs::DrugConfig",
    "members": [
      {
        "name": "drug",
        "type": "rollyourown::config::drugs::Drugs"
      },
      {
        "name": "drug_id",
        "type": "core::integer::u8"
      },
      {
        "name": "base",
        "type": "core::integer::u16"
      },
      {
        "name": "step",
        "type": "core::integer::u16"
      },
      {
        "name": "weight",
        "type": "core::integer::u16"
      },
      {
        "name": "name",
        "type": "rollyourown::utils::bytes16::Bytes16"
      }
    ]
  },
  {
    "type": "interface",
    "name": "rollyourown::config::config::IConfig",
    "items": [
      {
        "type": "function",
        "name": "initialize",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_config",
        "inputs": [],
        "outputs": [
          {
            "type": "rollyourown::config::config::Config"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "update_game_config",
        "inputs": [
          {
            "name": "game_config",
            "type": "rollyourown::config::game::GameConfig"
          }
        ],
        "outputs": [],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "update_drug_config",
        "inputs": [
          {
            "name": "drug_config",
            "type": "rollyourown::config::drugs::DrugConfig"
          }
        ],
        "outputs": [],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "UpgradableImpl",
    "interface_name": "dojo::components::upgradeable::IUpgradeable"
  },
  {
    "type": "interface",
    "name": "dojo::components::upgradeable::IUpgradeable",
    "items": [
      {
        "type": "function",
        "name": "upgrade",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "event",
    "name": "dojo::components::upgradeable::upgradeable::Upgraded",
    "kind": "struct",
    "members": [
      {
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "dojo::components::upgradeable::upgradeable::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "dojo::components::upgradeable::upgradeable::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "rollyourown::config::config::config::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpgradeableEvent",
        "type": "dojo::components::upgradeable::upgradeable::Event",
        "kind": "nested"
      }
    ]
  }
] as const;
