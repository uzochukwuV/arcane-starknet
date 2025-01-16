use core::starknet::ContractAddress;

#[starknet::interface]
pub trait IPragmaVRF<TContractState> {
    fn get_last_random_number(self: @TContractState) -> felt252;
    fn request_randomness_from_pragma(
        ref self: TContractState,
        seed: u64,
        callback_address: ContractAddress,
        callback_fee_limit: u128,
        publish_delay: u64,
        num_words: u64,
        calldata: Array<felt252>,
    );
    fn receive_random_words(
        ref self: TContractState,
        requester_address: ContractAddress,
        request_id: u64,
        random_words: Span<felt252>,
        calldata: Array<felt252>,
    );
    fn withdraw_extra_fee_fund(ref self: TContractState, receiver: ContractAddress);
}
/// Trait defining the functions that can be implemented or called by the Starknet Contract
#[starknet::interface]
pub trait IArcane<ContractState> {
    fn get_all_listings(self: @ContractState) -> Array::<u256>;
    fn get_token(self: @ContractState) -> u256;
    fn get_asset_price(self: @ContractState, asset_id: felt252) -> u128;
    fn fund(ref self: ContractState, amount: u256, coin_contract_address: ContractAddress);
    fn list_nft(
        ref self: ContractState,
        nft_contract_address: ContractAddress,
        coin_contract_address: ContractAddress,
        token_id: u256,
        price: u128,
    ) -> bool;
    fn buy_nft(
        ref self: ContractState,
        nft_contract_address: ContractAddress,
        coin_contract_address: ContractAddress,
        token_id: u256,
        coin_type: u128,
    );

    fn create_game(ref self: ContractState) ;
    fn get_lucky_number(self: @ContractState);
    fn get_game_pool(self: @ContractState);
    fn get_game_id(self: @ContractState);
    
    fn play(ref self: ContractState, guess: u128, game_id: u128, amount: u256, coin_type: u128,coin_contract_address:ContractAddress);
    fn end_game(ref self: ContractState, game_id:u128);
    fn get_reward(ref self: ContractState, game_id:u128);
}


#[starknet::contract]
pub mod Arcane {
    use starknet::event::EventEmitter;
    use starknet::storage::StoragePathEntry;
    use starknet::storage::StorageMapWriteAccess;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::ERC721ReceiverComponent;
    use starknet::ContractAddress;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map, Vec, VecTrait, MutableVecTrait,
    };
    use core::starknet::{
        get_caller_address, get_contract_address, contract_address_const, get_block_number,
    };
    use openzeppelin::token::erc721::{ERC721ABIDispatcher, ERC721ABIDispatcherTrait};
    use openzeppelin::token::erc20::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use core::array::{ArrayTrait, Array, ArrayImpl};
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{DataType, PragmaPricesResponse};
    use pragma_lib::abi::{IRandomnessDispatcher, IRandomnessDispatcherTrait};
    use core::option::{OptionTrait, Option};
    use core::traits::{Into};


    component!(path: ERC721ReceiverComponent, storage: erc721_receiver, event: ERC721ReceiverEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // ERC721Receiver Mixin
    #[abi(embed_v0)]
    impl ERC721ReceiverMixinImpl =
        ERC721ReceiverComponent::ERC721ReceiverMixinImpl<ContractState>;
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
        listing_to_price: Map::<u256, u128>,
        pragma_contract: ContractAddress,
        tokens: u256,
        games: u128,
        guesses: Map::<ContractAddress, u128>,
        players_stakes: Map::<ContractAddress, u128>,
        players: Vec<ContractAddress>,
        game_state: bool,
        game_pool: u128,
        winner_pool: u128,
        lucky_number: u128,
        pragma_vrf_contract_address: ContractAddress,
        last_random_number: felt252,
        min_block_number_storage: u64,
    }

    const LISTREWARD: u256 = 50;
    const BUYREWARD: u256 = 100;
    const USDT_TO_ARC: u256 = 100;
    const ETH_USD: felt252 = 19514442401534788;
    const STRK_USDT: felt252 = 6004514686061859652;
    const EIGHT_DECIMAL_FACTOR: u256 = 100000000;
    const ETH: u128 = 1;
    const STRK: u128 = 1;
    const ARC: u128 = 1;



    #[derive(Drop, starknet::Event)]
    struct LotteryResult {
        game_id: u128,
        win: u128,
        winners: Array::<ContractAddress>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721ReceiverEvent: ERC721ReceiverComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        NFTEvent: NFTEvent,
        LotteryResult: LotteryResult,
        NFTBUYEvent: NFTBUYEvent,
        PlayEvent:PlayEvent
    }

    #[derive(Drop, starknet::Event)]
    pub struct NFTEvent {
        token_id: u256,
        from: ContractAddress,
        to: ContractAddress,
        event_type: u128,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PlayEvent {
        player: ContractAddress,
        game_id: u128,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct NFTBUYEvent {
        token_id: u256,
        from: ContractAddress,
        to: ContractAddress,
        event_type: u128,
        amount: u256,
        coin_type: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        pragma_vrf_contract_address: ContractAddress,
        pragma_address: ContractAddress,
        owner: ContractAddress,
    ) {
        self.erc721_receiver.initializer();
        self.pragma_vrf_contract_address.write(pragma_vrf_contract_address);
        self.ownable.initializer(owner);
        self.pragma_contract.write(pragma_address);
        self.tokens.write(0);
    }


    #[abi(embed_v0)]
    impl ArcaneImpl of super::IArcane<ContractState> {
        fn end_game(ref self: ContractState, game_id:u128){
            self.ownable.assert_only_owner();
            let lucky_number: u256 = self.last_random_number.read().into() % 9 + 1;
            self.lucky_number.write(lucky_number.try_into().unwrap());

            let mut game_pool:u128 = 0;
            let mut win_pool :u128 = 0;
            for i in 0..self.players.len() {
                let playerGuess = self.guesses.entry(get_caller_address()).read();
                let playerStake = self.players_stakes.entry(get_caller_address()).read();

                game_pool += playerStake;
                if playerGuess == lucky_number.try_into().unwrap(){
                    win_pool += playerStake;
                }
            };
            self.game_state.write(false);
            self.game_pool.write(game_pool);
            self.winner_pool.write(win_pool)

        }
    fn get_reward(ref self: ContractState, game_id:u128){}
        fn create_game(ref self: ContractState) {
            self.ownable.assert_only_owner();
            let game = self.games.read();
            self.games.write(game + 1);
        }

    
    fn get_lucky_number(self: @ContractState){}
    fn get_game_pool(self: @ContractState){}
    fn get_game_id(self: @ContractState){}

        fn play(
            ref self: ContractState, guess: u128, game_id: u128, amount: u256, coin_type: u128,coin_contract_address:ContractAddress
        ) {
            assert!(amount > 1, "INVALID_AMOUNT");
            assert!(self.game_state.read(), "NOt_ACTIVE");

            self.guesses.entry(get_caller_address()).write(guess);
            self.players_stakes.entry(get_caller_address()).write(amount.try_into().unwrap());
            self.players.append().write(get_caller_address());
            if coin_type == ETH {
                let eth_price = self.get_asset_price(ETH_USD).into();
                let eth_needed = amount * EIGHT_DECIMAL_FACTOR / eth_price;
                let eth_dispatcher = ERC20ABIDispatcher {
                    contract_address: contract_address_const::<
                        0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7,
                    >() // ETH Contract Address
                };

                eth_dispatcher
                    .transfer_from(get_caller_address(), get_contract_address(), eth_needed);
                self.emit(PlayEvent{
                    player: get_caller_address(),
                    game_id: game_id,
                    amount: amount,
                });
            } else if coin_type == STRK {
                let strk_price = self.get_asset_price(ETH_USD).into();
                let strk_needed = amount * EIGHT_DECIMAL_FACTOR / strk_price;
                let strk_dispatcher = ERC20ABIDispatcher {
                    contract_address: contract_address_const::<
                        0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D,
                    >() // ETH Contract Address
                };

                strk_dispatcher
                    .transfer_from(get_caller_address(), get_contract_address(), strk_needed);
                self.emit(PlayEvent{
                    player: get_caller_address(),
                    game_id: game_id,
                    amount: amount,
                });
            } else if coin_type == ARC {
                let arc_needed = amount * EIGHT_DECIMAL_FACTOR / USDT_TO_ARC;
                let arc_dispatcher = ERC20ABIDispatcher { contract_address: coin_contract_address };
                arc_dispatcher.transfer_from(get_caller_address(), get_contract_address(), arc_needed - BUYREWARD);
                self.emit(PlayEvent{
                    player: get_caller_address(),
                    game_id: game_id,
                    amount: amount,
                });
            }else {
                assert!(false, "NOT_A_VALID_SELECTION");
            }
        }

        fn list_nft(
            ref self: ContractState,
            nft_contract_address: ContractAddress,
            coin_contract_address: ContractAddress,
            token_id: u256,
            price: u128,
        ) -> bool {
            let nft = ERC721ABIDispatcher { contract_address: nft_contract_address };
            let nft_owner = nft.owner_of(token_id);

            assert!(get_caller_address() == nft_owner, "NOT_ALLOWED");
            let mut data = array![];
            nft
                .safe_transfer_from(
                    get_caller_address(),
                    get_contract_address(),
                    token_id,
                    (data.try_into().unwrap()),
                );

            self.nfts.append().write(token_id);
            self.listings.write(token_id, get_caller_address());
            self.listing_to_price.write(token_id, price);
            let contract = ERC20ABIDispatcher { contract_address: coin_contract_address };
            contract.transfer(get_caller_address(), LISTREWARD);
            self
                .emit(
                    NFTEvent {
                        token_id: token_id,
                        from: get_caller_address(),
                        to: get_contract_address(),
                        event_type: 1,
                        amount: price.into(),
                    },
                );
            true
        }

        fn get_all_listings(self: @ContractState) -> Array::<u256> {
            let mut token_ids = array![];
            for i in 0..self.nfts.len() {
                token_ids.append(self.nfts.at(i).read());
            };
            token_ids
        }

        fn fund(ref self: ContractState, amount: u256, coin_contract_address: ContractAddress) {
            let contract = ERC20ABIDispatcher { contract_address: coin_contract_address };
            contract.transfer_from(get_caller_address(), get_contract_address(), amount);
            self.tokens.write(self.tokens.read() + amount);
        }

        fn get_token(self: @ContractState) -> u256 {
            self.tokens.read()
        }


        fn buy_nft(
            ref self: ContractState,
            nft_contract_address: ContractAddress,
            coin_contract_address: ContractAddress,
            token_id: u256,
            coin_type: u128,
        ) {
            let nft = ERC721ABIDispatcher { contract_address: nft_contract_address };

            assert!(nft.owner_of(token_id) == get_contract_address(), "NOT_LISTED");
            let owner = self.listings.entry(token_id).read();
            let nft_price = self.listing_to_price.entry(token_id).read().try_into().unwrap();
            if coin_type == ETH {
                let eth_price = self.get_asset_price(ETH_USD).into();
                let eth_needed = nft_price * EIGHT_DECIMAL_FACTOR / eth_price;

                let eth_dispatcher = ERC20ABIDispatcher {
                    contract_address: contract_address_const::<
                        0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7,
                    >() // ETH Contract Address
                };

                eth_dispatcher.transfer_from(get_caller_address(), owner, eth_needed);

                nft.transfer_from(get_contract_address(), get_caller_address(), token_id);
                let contract = ERC20ABIDispatcher { contract_address: coin_contract_address };
                contract.transfer(get_caller_address(), BUYREWARD);
                self
                    .emit(
                        NFTBUYEvent {
                            token_id: token_id,
                            from: get_caller_address(),
                            to: get_contract_address(),
                            event_type: 2,
                            amount: nft_price,
                            coin_type: 1,
                        },
                    )
            } else if coin_type == STRK {
                let strk_price = self.get_asset_price(STRK_USDT).into();

                let strk_needed = nft_price * EIGHT_DECIMAL_FACTOR / strk_price;

                let strk_dispatcher = ERC20ABIDispatcher {
                    contract_address: contract_address_const::<
                        0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D,
                    >() // ETH Contract Address
                };

                strk_dispatcher.transfer_from(get_caller_address(), owner, strk_needed);

                nft.transfer_from(get_contract_address(), get_caller_address(), token_id);
                let contract = ERC20ABIDispatcher { contract_address: coin_contract_address };
                contract.transfer(get_caller_address(), BUYREWARD);
                self
                    .emit(
                        NFTBUYEvent {
                            token_id: token_id,
                            from: get_caller_address(),
                            to: get_contract_address(),
                            event_type: 2,
                            amount: nft_price,
                            coin_type: 2,
                        },
                    )
            } else if coin_type == ARC {
                let arc_needed = nft_price * EIGHT_DECIMAL_FACTOR / USDT_TO_ARC;
                let arc_dispatcher = ERC20ABIDispatcher { contract_address: coin_contract_address };
                arc_dispatcher.transfer_from(get_caller_address(), owner, arc_needed - BUYREWARD);
                self
                    .emit(
                        NFTBUYEvent {
                            token_id: token_id,
                            from: get_caller_address(),
                            to: get_contract_address(),
                            event_type: 2,
                            amount: nft_price,
                            coin_type: 3,
                        },
                    )
            } else {
                assert!(false, "NOT_A_VALID_SELECTION");
            }
        }


        fn get_asset_price(self: @ContractState, asset_id: felt252) -> u128 {
            // Retrieve the oracle dispatcher
            let oracle_dispatcher = IPragmaABIDispatcher {
                contract_address: self.pragma_contract.read(),
            };

            // Call the Oracle contract, for a spot entry
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data_median(DataType::SpotEntry(asset_id));

            return output.price;
        }
    }


    #[abi(embed_v0)]
    impl PragmaVRFOracle of super::IPragmaVRF<ContractState> {
        fn get_last_random_number(self: @ContractState) -> felt252 {
            let last_random = self.last_random_number.read();
            last_random
        }

        fn request_randomness_from_pragma(
            ref self: ContractState,
            seed: u64,
            callback_address: ContractAddress,
            callback_fee_limit: u128,
            publish_delay: u64,
            num_words: u64,
            calldata: Array<felt252>,
        ) {
            self.ownable.assert_only_owner();

            let randomness_contract_address = self.pragma_vrf_contract_address.read();
            let randomness_dispatcher = IRandomnessDispatcher {
                contract_address: randomness_contract_address,
            };

            // Approve the randomness contract to transfer the callback fee
            // You would need to send some ETH to this contract first to cover the fees
            let eth_dispatcher = ERC20ABIDispatcher {
                contract_address: contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7,
                >() // ETH Contract Address
            };
            eth_dispatcher
                .approve(
                    randomness_contract_address,
                    (callback_fee_limit + callback_fee_limit / 5).into(),
                );

            // Request the randomness
            randomness_dispatcher
                .request_random(
                    seed, callback_address, callback_fee_limit, publish_delay, num_words, calldata,
                );

            let current_block_number = get_block_number();
            self.min_block_number_storage.write(current_block_number + publish_delay);
        }

        fn receive_random_words(
            ref self: ContractState,
            requester_address: ContractAddress,
            request_id: u64,
            random_words: Span<felt252>,
            calldata: Array<felt252>,
        ) {
            // Have to make sure that the caller is the Pragma Randomness Oracle contract
            let caller_address = get_caller_address();
            assert(
                caller_address == self.pragma_vrf_contract_address.read(),
                'caller not randomness contract',
            );
            // and that the current block is within publish_delay of the request block
            let current_block_number = get_block_number();
            let min_block_number = self.min_block_number_storage.read();
            assert(min_block_number <= current_block_number, 'block number issue');

            let random_word = *random_words.at(0);
            self.last_random_number.write(random_word);
        }

        fn withdraw_extra_fee_fund(ref self: ContractState, receiver: ContractAddress) {
            self.ownable.assert_only_owner();
            let eth_dispatcher = ERC20ABIDispatcher {
                contract_address: contract_address_const::<
                    0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7,
                >() // ETH Contract Address
            };
            let balance = eth_dispatcher.balance_of(get_contract_address());
            eth_dispatcher.transfer(receiver, balance);
        }
    }
}
