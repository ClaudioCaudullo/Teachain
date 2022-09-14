// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract recensioni {
    address public owner; 
    uint256 private counter; 

    constructor(){
        counter= 0;
        owner=msg.sender;
    }

    struct recensione{
        address creatore;
        address recensito;
        uint256 id;    
        string hash;
    }

    event recensioneCreata(
        address creatore,
        address recensito,
        uint256 id,
        string hash
    );

    mapping(uint256 => recensione) Recensioni;

    function addRecensione(
        string memory _postHash,
        address recensito
    ) public {
        recensione storage newRecensione= Recensioni[counter];
        newRecensione.hash=_postHash;
        newRecensione.id= counter;
        newRecensione.creatore=msg.sender;
        newRecensione.recensito=recensito;
        Recensioni[counter]= newRecensione;
        counter++;
        emit recensioneCreata(
            msg.sender,
            recensito,
            counter,
            _postHash
        );
    }

    function getRecensioniNumber() public view returns(uint256)
    {
        return counter;
    }

    function getRecensione(uint256 id) public view returns(
        string memory,
        address){
            require(id<counter, "Non esiste un corso con questo id");
            recensione storage c= Recensioni[id];
            return(c.hash,c.creatore);
    }

    function getAllRecensioni() external view returns (recensione[] memory _recensioni) {
        _recensioni = new recensione[](counter);
        for (uint256 i = 0; i < _recensioni.length; i++) {
            _recensioni[i] = Recensioni[i];
        }
    }

    function getAllRecensioniByUserId(address userid) external view returns (recensione[] memory _recensioni) {
        _recensioni = new recensione[](counter);
        uint256 j=0;
        for (uint256 i = 0; i < _recensioni.length; i++) {
            if(Recensioni[i].recensito==userid) 
            {
                _recensioni[j] = Recensioni[i];
                j++;
            }
        }
        return _recensioni;
    }

        function modificaRecensione(string calldata oldHash,string calldata newHash) public returns(string memory){
        for (uint256 i = 0; i <counter; i++) {
            if (Recensioni[i].id>=0 && (keccak256(abi.encodePacked(Recensioni[i].hash)) == keccak256(abi.encodePacked(oldHash))))             
            {
                Recensioni[i].hash=newHash;
                return(Recensioni[i].hash);
            }
        }
    }


    function eliminaRecensione(uint256 idRecensione) public {
        for (uint256 i = 0; i < counter; i++) {
            if(Recensioni[i].id>=0 && Recensioni[i].id==idRecensione) {
                Recensioni[i].hash="-1";
                return;
            }
        }
    }
    
}