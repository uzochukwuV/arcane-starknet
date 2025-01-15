

use core::starknet::ContractAddress;
/// Trait defining the functions that can be implemented or called by the Starknet Contract
#[starknet::interface]
pub trait IArcane<ContractState> {
    fn get_all_listings(self:@ContractState)-> Array::<u256>;
    fn get_token(self:@ContractState)-> u256;
           
    fn fund(ref self:ContractState, amount:u256, coin_contract_address:ContractAddress);
    fn list_nft(ref self: ContractState, nft_contract_address:ContractAddress, coin_contract_address:ContractAddress, token_id:u256, price:u128)-> bool;
    fn list(ref self: ContractState, nft_contract_address:ContractAddress,  token_id:u256, price:u128)-> bool;
}


#[starknet::contract]
pub mod Arcane {
    use starknet::storage::StorageMapWriteAccess;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::ERC721ReceiverComponent;
    use starknet::ContractAddress;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,Map, Vec,VecTrait, MutableVecTrait
    };
    use core::starknet::{ get_caller_address, get_contract_address};
    use openzeppelin::token::erc721::{ERC721ABIDispatcher,ERC721ABIDispatcherTrait};
    use openzeppelin::token::erc20::{ERC20ABIDispatcher,ERC20ABIDispatcherTrait};
    use core::array::{ArrayTrait, Array, ArrayImpl};

    component!(path: ERC721ReceiverComponent, storage: erc721_receiver, event: ERC721ReceiverEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // ERC721Receiver Mixin
    #[abi(embed_v0)]
    impl ERC721ReceiverMixinImpl = ERC721ReceiverComponent::ERC721ReceiverMixinImpl<ContractState>;
    impl ERC721ReceiverInternalImpl = ERC721ReceiverComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721_receiver: ERC721ReceiverComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        nfts: Vec::<u256>,
        listings: Map::<u256, ContractAddress>,
        listing_to_price:Map::<u256, u128>,
        pragma_contract:ContractAddress,
        tokens:u256,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721ReceiverEvent: ERC721ReceiverComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, pragma_address:ContractAddress,owner: ContractAddress) {
        self.erc721_receiver.initializer();
        self.ownable.initializer(owner);
        self.pragma_contract.write(pragma_address);
        self.tokens.write(0);
    }

    #[abi(embed_v0)]
    impl ArcaneImpl of super::IArcane<ContractState> {
        fn list_nft(ref self: ContractState, nft_contract_address:ContractAddress, coin_contract_address:ContractAddress, token_id:u256, price:u128)-> bool{
            let nft = ERC721ABIDispatcher{contract_address:nft_contract_address};
            let nft_owner = nft.owner_of(token_id);
    
            assert!( get_caller_address() == nft_owner, "NOT_ALLOWED");
            let mut data = array![];
            nft.safe_transfer_from(get_caller_address(), get_contract_address(), token_id, (data.try_into().unwrap()));
    
            self.nfts.append().write(token_id);
            self.listings.write(token_id, get_caller_address());
            self.listing_to_price.write(token_id, price);
            let contract = ERC20ABIDispatcher{contract_address:coin_contract_address};
            contract.transfer( get_caller_address(), 500);
            true
        }
    
        fn get_all_listings(self:@ContractState)-> Array::<u256>{
            let mut token_ids = array![];
            for i in 0..self.nfts.len() {
                token_ids.append(self.nfts.at(i).read());
            };
            token_ids
        }

        fn fund(ref self:ContractState, amount:u256, coin_contract_address:ContractAddress){
           
            let contract = ERC20ABIDispatcher{contract_address:coin_contract_address};
            contract.transfer_from( get_caller_address(),get_contract_address(), amount);
            self.tokens.write(self.tokens.read() + amount);
        }

        fn get_token(self:@ContractState)-> u256{
            self.tokens.read()
        }

        fn list(ref self: ContractState, nft_contract_address:ContractAddress,  token_id:u256, price:u128)-> bool{
            let nft = ERC721ABIDispatcher{contract_address:nft_contract_address};
            let nft_owner = nft.owner_of(token_id);
            assert!( get_caller_address() == nft_owner, "NOT_ALLOWED");

            let mut data = array![];
            nft.safe_transfer_from(get_caller_address(), get_contract_address(), token_id, (data.try_into().unwrap()));
            self.nfts.append().write(token_id);
            self.listings.write(token_id, get_caller_address());
            self.listing_to_price.write(token_id, price);
            true
        }

    
    }

    

}