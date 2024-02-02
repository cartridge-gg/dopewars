export const ABI = [
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
    "type": "struct",
    "name": "rollyourown::config::config::Config",
    "members": [
      {
        "name": "layouts",
        "type": "rollyourown::config::config::LayoutsConfig"
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
    "type": "function",
    "name": "dojo_resource",
    "inputs": [],
    "outputs": [
      {
        "type": "core::felt252"
      }
    ],
    "state_mutability": "view"
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
