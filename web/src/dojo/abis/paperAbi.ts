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
    "name": "PaperMockInitializerImpl",
    "interface_name": "rollyourown::_mocks::paper_mock::IPaperMockInitializer"
  },
  {
    "type": "interface",
    "name": "rollyourown::_mocks::paper_mock::IPaperMockInitializer",
    "items": [
      {
        "type": "function",
        "name": "initializer",
        "inputs": [],
        "outputs": [],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "PaperMockFaucetImpl",
    "interface_name": "rollyourown::_mocks::paper_mock::IPaperMockFaucet"
  },
  {
    "type": "interface",
    "name": "rollyourown::_mocks::paper_mock::IPaperMockFaucet",
    "items": [
      {
        "type": "function",
        "name": "faucet",
        "inputs": [],
        "outputs": [],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "faucetTo",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
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
    "type": "impl",
    "name": "ERC20MetadataImpl",
    "interface_name": "token::components::token::erc20::erc20_metadata::IERC20Metadata"
  },
  {
    "type": "interface",
    "name": "token::components::token::erc20::erc20_metadata::IERC20Metadata",
    "items": [
      {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ERC20MetadataTotalSupplyImpl",
    "interface_name": "token::components::token::erc20::erc20_metadata::IERC20MetadataTotalSupply"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "interface",
    "name": "token::components::token::erc20::erc20_metadata::IERC20MetadataTotalSupply",
    "items": [
      {
        "type": "function",
        "name": "total_supply",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ERC20MetadataTotalSupplyCamelImpl",
    "interface_name": "token::components::token::erc20::erc20_metadata::IERC20MetadataTotalSupplyCamel"
  },
  {
    "type": "interface",
    "name": "token::components::token::erc20::erc20_metadata::IERC20MetadataTotalSupplyCamel",
    "items": [
      {
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ERC20BalanceImpl",
    "interface_name": "token::components::token::erc20::erc20_balance::IERC20Balance"
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
    "type": "interface",
    "name": "token::components::token::erc20::erc20_balance::IERC20Balance",
    "items": [
      {
        "type": "function",
        "name": "balance_of",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer_from",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ERC20BalanceCamelImpl",
    "interface_name": "token::components::token::erc20::erc20_balance::IERC20BalanceCamel"
  },
  {
    "type": "interface",
    "name": "token::components::token::erc20::erc20_balance::IERC20BalanceCamel",
    "items": [
      {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "impl",
    "name": "ERC20AllowanceImpl",
    "interface_name": "token::components::token::erc20::erc20_allowance::IERC20Allowance"
  },
  {
    "type": "interface",
    "name": "token::components::token::erc20::erc20_allowance::IERC20Allowance",
    "items": [
      {
        "type": "function",
        "name": "allowance",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "approve",
        "inputs": [
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
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
    "name": "token::components::security::initializable::initializable_component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_metadata::erc20_metadata_component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_balance::erc20_balance_component::Transfer",
    "kind": "struct",
    "members": [
      {
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_balance::erc20_balance_component::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Transfer",
        "type": "token::components::token::erc20::erc20_balance::erc20_balance_component::Transfer",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_allowance::erc20_allowance_component::Approval",
    "kind": "struct",
    "members": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_allowance::erc20_allowance_component::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Approval",
        "type": "token::components::token::erc20::erc20_allowance::erc20_allowance_component::Approval",
        "kind": "nested"
      }
    ]
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_mintable::erc20_mintable_component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "token::components::token::erc20::erc20_burnable::erc20_burnable_component::Event",
    "kind": "enum",
    "variants": []
  },
  {
    "type": "event",
    "name": "rollyourown::_mocks::paper_mock::paper_mock::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpgradeableEvent",
        "type": "dojo::components::upgradeable::upgradeable::Event",
        "kind": "nested"
      },
      {
        "name": "InitializableEvent",
        "type": "token::components::security::initializable::initializable_component::Event",
        "kind": "nested"
      },
      {
        "name": "ERC20MetadataEvent",
        "type": "token::components::token::erc20::erc20_metadata::erc20_metadata_component::Event",
        "kind": "nested"
      },
      {
        "name": "ERC20BalanceEvent",
        "type": "token::components::token::erc20::erc20_balance::erc20_balance_component::Event",
        "kind": "nested"
      },
      {
        "name": "ERC20AllowanceEvent",
        "type": "token::components::token::erc20::erc20_allowance::erc20_allowance_component::Event",
        "kind": "nested"
      },
      {
        "name": "ERC20MintableEvent",
        "type": "token::components::token::erc20::erc20_mintable::erc20_mintable_component::Event",
        "kind": "nested"
      },
      {
        "name": "ERC20BurnableEvent",
        "type": "token::components::token::erc20::erc20_burnable::erc20_burnable_component::Event",
        "kind": "nested"
      }
    ]
  }
] as const;
