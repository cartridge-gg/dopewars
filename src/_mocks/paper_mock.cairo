use dojo::world::IWorldDispatcher;
use starknet::{ContractAddress, ClassHash};

#[starknet::interface]
trait IPaperMock<TState> {
    // IWorldProvider
    fn world(self: @TState,) -> IWorldDispatcher;

    // IUpgradeable
    fn upgrade(ref self: TState, new_class_hash: ClassHash);

    // IERC20Metadata
    fn decimals(self: @TState,) -> u8;
    fn name(self: @TState,) -> felt252;
    fn symbol(self: @TState,) -> felt252;

    // IERC20MetadataTotalSupply
    fn total_supply(self: @TState,) -> u256;

    // IERC20MetadataTotalSupplyCamel
    fn totalSupply(self: @TState,) -> u256;

    // IERC20Balance
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn transfer(ref self: TState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    // IERC20BalanceCamel
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn transferFrom(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    // IERC20Allowance
    fn allowance(self: @TState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn approve(ref self: TState, spender: ContractAddress, amount: u256) -> bool;
}


#[starknet::interface]
trait IPaperMockFaucet<TState> {
    fn faucet(ref self: TState,);
    fn faucetTo(ref self: TState, recipient: ContractAddress);
}


#[dojo::contract]
mod paper_mock {
    // use openzeppelin::token::erc20::ERC20HooksEmptyImpl;
    use dojo::event::EventStorage;
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use openzeppelin_token::erc20::ERC20Component;
    use openzeppelin_token::erc20::interface::IERC20Metadata;
    use rollyourown::store::{Store, StoreImpl, StoreTrait};
    use starknet::{ContractAddress, get_caller_address};

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
        self.erc20.initializer("fPaper", "fPAPER");

        let (laundromat_address, _) = self.world(@"dopewars").dns(@"laundromat").unwrap();
        self.faucetTo(laundromat_address);
    }

    //
    // Faucet
    //

    const ETHER: u256 = 1_000_000_000_000_000_000;

    #[abi(embed_v0)]
    impl PaperMockFaucetImpl of super::IPaperMockFaucet<ContractState> {
        fn faucet(ref self: ContractState) {
            self.erc20.mint(get_caller_address(), 10_000 * ETHER);
        }
        fn faucetTo(ref self: ContractState, recipient: ContractAddress) {
            self.erc20.mint(recipient, 10_000 * ETHER);
        }
    }

    pub impl ERC20HooksImpl of ERC20Component::ERC20HooksTrait<ContractState> {
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

            let mut world = contract_state.world(@"dopewars");

            world
                .emit_event(
                    @ERC20BalanceEvent {
                        token_address: starknet::get_contract_address(),
                        owner: from,
                        balance: balance_from
                    }
                );
            world
                .emit_event(
                    @ERC20BalanceEvent {
                        token_address: starknet::get_contract_address(),
                        owner: recipient,
                        balance: balance_recipient
                    }
                );
        }
    }
}

