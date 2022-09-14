// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PurchaseAgreement {

    uint public value;
    address payable public seller;
    address payable public buyer;


    enum State{ Created, Locked, Release, Inactive }

    State public state; //di default prende il primo valore , quindi Created

    constructor() payable{
        seller = payable(msg.sender);
        value = msg.value / 2; 
    }


    // il messaggio di errore lo passo scritto con 3 slash sopra la funzione di errore

    /// The function cannot be called at the current state.
    error InvalidState();

    ///Only the buyer can call this function
    error OnlyBuyer();

    ///Only the seller can call this function
    error OnlySeller();

    modifier inState(State state_){
        if(state != state_){
            revert InvalidState();
        }
        _;
    }

    modifier onlyBuyer(){
        if(msg.sender != buyer){
            revert OnlyBuyer();
        }
        _;
    }

    modifier onlySeller(){
        if(msg.sender != seller){
            revert OnlySeller();
        }
        _;
    }

    function confirmPurchase() external inState(State.Created) payable { //external permette di invocare questa funzuione fuori dallo smart contract
        require(msg.value == (2* value),"Please send in 2x the purchase amount"); //perhè 2 volte il valore? Per dare sicurezza al processo di acquisto. Così il compratore non potrà dire di non aver ricevuto l'item , altrimenti non avrebbe rimborsato la metà del pagamento
        buyer= payable(msg.sender);
        state= State.Locked;
    }

    function confirmReceived() external inState(State.Locked) {
        state = State.Release;
        buyer.transfer(value); //rimborso al compratore
    } 

    function paySeller() external onlySeller inState(State.Release) {
        state= State.Inactive;
        seller.transfer(3* value);
    }

    function abort() external onlySeller inState(State.Created){
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }


}