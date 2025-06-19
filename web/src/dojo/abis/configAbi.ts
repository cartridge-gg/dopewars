export const ABI = [
  {
    "type": "impl",
    "name": "config__ContractImpl",
    "interface_name": "dojo::contract::interface::IContract"
  },
  {
    "type": "interface",
    "name": "dojo::contract::interface::IContract",
    "items": []
  },
  {
    "type": "impl",
    "name": "config__DeployedContractImpl",
    "interface_name": "dojo::meta::interface::IDeployedResource"
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "interface",
    "name": "dojo::meta::interface::IDeployedResource",
    "items": [
      {
        "type": "function",
        "name": "dojo_name",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "function",
    "name": "dojo_init",
    "inputs": [],
    "outputs": [],
    "state_mutability": "external"
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
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::ryo::RyoConfig",
    "members": [
      {
        "name": "key",
        "type": "core::integer::u8"
      },
      {
        "name": "initialized",
        "type": "core::bool"
      },
      {
        "name": "paused",
        "type": "core::bool"
      },
      {
        "name": "season_version",
        "type": "core::integer::u16"
      },
      {
        "name": "season_duration",
        "type": "core::integer::u32"
      },
      {
        "name": "season_time_limit",
        "type": "core::integer::u16"
      },
      {
        "name": "paper_fee",
        "type": "core::integer::u16"
      },
      {
        "name": "paper_reward_launderer",
        "type": "core::integer::u16"
      },
      {
        "name": "treasury_fee_pct",
        "type": "core::integer::u8"
      },
      {
        "name": "treasury_balance",
        "type": "core::integer::u32"
      },
      {
        "name": "f2p_hustlers",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::CashMode",
    "variants": [
      {
        "name": "Broke",
        "type": "()"
      },
      {
        "name": "Average",
        "type": "()"
      },
      {
        "name": "Rich",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::CashMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::CashMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::HealthMode",
    "variants": [
      {
        "name": "Junkie",
        "type": "()"
      },
      {
        "name": "Hustler",
        "type": "()"
      },
      {
        "name": "Streetboss",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::HealthMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::HealthMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::TurnsMode",
    "variants": [
      {
        "name": "OnSpeed",
        "type": "()"
      },
      {
        "name": "OnWeed",
        "type": "()"
      },
      {
        "name": "OnMush",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::TurnsMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::TurnsMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::EncountersMode",
    "variants": [
      {
        "name": "Chill",
        "type": "()"
      },
      {
        "name": "NoJokes",
        "type": "()"
      },
      {
        "name": "UltraViolence",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::EncountersMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::EncountersMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::EncountersOddsMode",
    "variants": [
      {
        "name": "Easy",
        "type": "()"
      },
      {
        "name": "Normal",
        "type": "()"
      },
      {
        "name": "Hard",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::EncountersOddsMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::EncountersOddsMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::DrugsMode",
    "variants": [
      {
        "name": "Cheap",
        "type": "()"
      },
      {
        "name": "Normal",
        "type": "()"
      },
      {
        "name": "Expensive",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::DrugsMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::DrugsMode>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "rollyourown::config::settings::WantedMode",
    "variants": [
      {
        "name": "KoolAndTheGang",
        "type": "()"
      },
      {
        "name": "ThugLife",
        "type": "()"
      },
      {
        "name": "MostWanted",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<rollyourown::config::settings::WantedMode>",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<rollyourown::config::settings::WantedMode>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "rollyourown::config::settings::SeasonSettingsModes",
    "members": [
      {
        "name": "cash_modes",
        "type": "core::array::Span::<rollyourown::config::settings::CashMode>"
      },
      {
        "name": "health_modes",
        "type": "core::array::Span::<rollyourown::config::settings::HealthMode>"
      },
      {
        "name": "turns_modes",
        "type": "core::array::Span::<rollyourown::config::settings::TurnsMode>"
      },
      {
        "name": "encounters_modes",
        "type": "core::array::Span::<rollyourown::config::settings::EncountersMode>"
      },
      {
        "name": "encounters_odds_modes",
        "type": "core::array::Span::<rollyourown::config::settings::EncountersOddsMode>"
      },
      {
        "name": "drugs_modes",
        "type": "core::array::Span::<rollyourown::config::settings::DrugsMode>"
      },
      {
        "name": "wanted_modes",
        "type": "core::array::Span::<rollyourown::config::settings::WantedMode>"
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
        "name": "ryo_config",
        "type": "rollyourown::config::ryo::RyoConfig"
      },
      {
        "name": "season_settings_modes",
        "type": "rollyourown::config::settings::SeasonSettingsModes"
      }
    ]
  },
  {
    "type": "interface",
    "name": "rollyourown::config::config::IConfig",
    "items": [
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
        "name": "emit_items_config",
        "inputs": [],
        "outputs": [],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "WorldProviderImpl",
    "interface_name": "dojo::contract::components::world_provider::IWorldProvider"
  },
  {
    "type": "struct",
    "name": "dojo::world::iworld::IWorldDispatcher",
    "members": [
      {
        "name": "contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "interface",
    "name": "dojo::contract::components::world_provider::IWorldProvider",
    "items": [
      {
        "type": "function",
        "name": "world_dispatcher",
        "inputs": [],
        "outputs": [
          {
            "type": "dojo::world::iworld::IWorldDispatcher"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "UpgradeableImpl",
    "interface_name": "dojo::contract::components::upgradeable::IUpgradeable"
  },
  {
    "type": "interface",
    "name": "dojo::contract::components::upgradeable::IUpgradeable",
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
    "type": "constructor",
    "name": "constructor",
    "inputs": []
  },
  {
    "type": "event",
    "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
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
    "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Upgraded",
        "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "dojo::contract::components::world_provider::world_provider_cpt::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "rollyourown::config::config::config::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpgradeableEvent",
        "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
        "kind": "nested"
      },
      {
        "name": "WorldProviderEvent",
        "type": "dojo::contract::components::world_provider::world_provider_cpt::Event",
        "kind": "nested"
      }
    ]
  }
] as const;
