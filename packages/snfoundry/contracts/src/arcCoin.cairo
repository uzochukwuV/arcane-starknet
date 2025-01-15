/// Interface representing `HelloContract`.
/// This interface allows modification and retrieval of the contract balance
use core::starknet::{ContractAddress};
#[starknet::interface]
pub trait IArcCoin<TContractState> {
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn mint(ref self: TContractState, amount: felt252, address: ContractAddress);
}

/// Simple contract for managing balance.
#[starknet::contract]
pub mod ArcCoin {
    use ERC20Component::InternalTrait;

    use core::starknet::{ContractAddress};
    use core::starknet::{get_caller_address};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;

    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // #[abi(embed_v0)]
    // impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    // impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);


    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_supply: felt252, owner: ContractAddress) {
        let name = "ArcCoin";
        let symbol = "Arc";
        self.ownable.initializer(owner);
        self.erc20.initializer(name, symbol);
        self.erc20.mint(owner, initial_supply.into());
    }


    #[generate_trait]
    #[abi(per_item)]
    impl ExternalImpl of ExternalTrait {
        #[external(v0)]
        fn burn(ref self: ContractState, value: u256) {
            self.erc20.burn(get_caller_address(), value);
        }

        #[external(v0)]
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.ownable.assert_only_owner();
            self.erc20.mint(recipient, amount);
        }
    }
}
