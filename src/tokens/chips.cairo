// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts for Cairo ^0.18.0

#[dojo::contract]
mod chips {
    use openzeppelin::token::erc20::ERC20Component;
    // use openzeppelin::token::erc20::ERC20HooksEmptyImpl;
    use openzeppelin::token::erc20::interface::IERC20Metadata;
    use starknet::{ContractAddress};

    use rollyourown::{library::store::{IStoreLibraryDispatcher, IStoreDispatcherTrait},};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;

    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::model]
    #[dojo::event]
    struct ERC20BalanceEvent {
        #[key]
        token_address: ContractAddress,
        #[key]
        owner: ContractAddress,
        balance: u256
    }

    #[abi(embed_v0)]
    fn dojo_init(ref self: ContractState) {
        self.erc20.initializer("Chips", "CHIPS");
    }

    #[generate_trait]
    #[abi(per_item)]
    impl ExternalImpl of ExternalTrait {
        #[external(v0)]
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.assert_only_minter();
            self.erc20.mint(recipient, amount);
        }
        #[external(v0)]
        fn burn(ref self: ContractState, owner: ContractAddress, amount: u256) {
            self.assert_only_burner();
            self.erc20.burn(owner, amount);
        }
    }

    impl ERC20Metadata<ContractState> of IERC20Metadata<ContractState> {
        /// Returns the name of the token.
        fn name(self: @ContractState) -> ByteArray {
            Self::name(self)
        }

        /// Returns the ticker symbol of the token, usually a shorter version of the name.
        fn symbol(self: @ContractState) -> ByteArray {
            Self::symbol(self)
        }

        /// Returns the number of decimals used to get its user representation.
        fn decimals(self: @ContractState) -> u8 {
            0
        }
    }


    #[generate_trait]
    impl ChipsInternalImpl of ChipsInternalTrait {
        fn assert_only_minter(self: @ContractState) {
            let caller = starknet::get_caller_address();
            let (_, game_address) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-game")
            );

            assert(caller == game_address, 'not minter!');
        }

        fn assert_only_burner(self: @ContractState) {
            let caller = starknet::get_caller_address();
            let (_, slot_address) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-slot")
            );
            assert(caller == slot_address, 'not burner!');
        }

        #[inline(always)]
        fn s(self: @ContractState,) -> IStoreLibraryDispatcher {
            let (class_hash, _) = rollyourown::utils::world_utils::get_contract_infos(
                self.world(), selector_from_tag!("dopewars-store")
            );
            IStoreLibraryDispatcher { class_hash, }
        }
    }

    pub impl ERC20HooksImpl<
        ContractState, +IWorldProvider
    > of ERC20Component::ERC20HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) {}

        fn after_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) {
            let contract_state = self.get_contract();

            let balance_from = contract_state.erc20.balance_of(from);
            let balance_recipient = contract_state.erc20.balance_of(recipient);

            emit!(
                contract_state.world(),
                (ERC20BalanceEvent {
                    token_address: starknet::get_contract_address(),
                    owner: from,
                    balance: balance_from
                })
            );

            emit!(
                contract_state.world(),
                (ERC20BalanceEvent {
                    token_address: starknet::get_contract_address(),
                    owner: recipient,
                    balance: balance_recipient
                })
            );
        }
    }
}
