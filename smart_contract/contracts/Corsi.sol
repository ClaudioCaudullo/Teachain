// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract corsi {
    address public owner;
    uint256 private counter;

    constructor(){
        counter= 0;
        owner=msg.sender;
    }

    struct corso{
        address creatore;
        uint256 id;    
        string hash;
        address[] acquirenti;
        string[] link;
        uint256 numeroAcquisti;
    }

    event corsoCreato(
        address creatore,
        uint256 id,
        string hash,
        uint256 numeroAcquisti
    );

    mapping(uint256 => corso) Corsi;

    function addCorso(
        string memory _postHash
    ) public payable {
        corso storage newCorso= Corsi[counter];
        newCorso.hash=_postHash;
        newCorso.id= counter;
        newCorso.creatore=msg.sender;
        newCorso.numeroAcquisti=0;
        Corsi[counter]= newCorso;
        counter++;
        emit corsoCreato(
            msg.sender,
            counter,
            _postHash,
            0
        );
    }

    function getCorsiNumber() public view returns(uint256)
    {
        return counter;
    }

    function getCorso(uint256 id) public view returns(
        string memory,
        address){
            require(id<counter, "Non esiste un corso con questo id");
            corso storage c= Corsi[id];
            return(c.hash,c.creatore);
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function getCorsoByHash(string calldata hashCorso) public view returns(
        string memory){
            for (uint256 i = 0; i < counter; i++) {
            if((keccak256(abi.encodePacked(Corsi[i].hash)) != "-1") && (keccak256(abi.encodePacked(Corsi[i].hash)) == (keccak256(abi.encodePacked(hashCorso))))) 
            {
                return(uint2str(Corsi[i].id));
            }
        }
            return("-1");
    }

    function getAllCorsi() external view returns (corso[] memory _corsi) {
        _corsi = new corso[](counter);
        for (uint256 i = 0; i < _corsi.length; i++) {
            if((keccak256(abi.encodePacked(Corsi[i].hash)) != "-1")) _corsi[i] = Corsi[i];
        }
    }



    function getAllCorsiByUserId(address userid) external view returns (corso[] memory _corsi) {
        _corsi = new corso[](counter);
        uint256 j=0;
        for (uint256 i = 0; i < _corsi.length; i++) {
            if((keccak256(abi.encodePacked(Corsi[i].hash)) != "-1") && Corsi[i].creatore==userid) 
            {
                _corsi[j] = Corsi[i];
                j++;
            }
        }
        return _corsi;
    }

    function modificaCorso(string calldata oldHash,string calldata newHash) public returns(string memory){
        for (uint256 i = 0; i <counter; i++) {
            if (Corsi[i].id>=0 && (keccak256(abi.encodePacked(Corsi[i].hash)) == keccak256(abi.encodePacked(oldHash))))             
            {
                Corsi[i].hash=newHash;
                return(Corsi[i].hash);
            }
        }
    }

    function eliminaCorso(uint256 idCorso) public {
        for (uint256 i = 0; i < counter; i++) {
            if(Corsi[i].id>=0 && Corsi[i].id==idCorso) {
                Corsi[i].hash="-1";
                return;
            }
        }
    }

    function addAcquisto(uint256 idCorso,address acquirente,string calldata link) public{
        for (uint256 i = 0; i < counter; i++) {
            if(Corsi[i].id>=0 && Corsi[i].id==idCorso) {
                Corsi[i].acquirenti.push(acquirente);
                Corsi[i].numeroAcquisti++;
                Corsi[i].link.push(link);
            }
        }
    }

    function getAcquisto(uint256 idCorso) public view returns(string memory){
        for(uint256 i=0;i<counter;i++)
        {
            if(Corsi[i].id>=0 && Corsi[i].id==idCorso)
            {
                for(uint256 j=0;j<Corsi[i].acquirenti.length;j++)
                {
                    if(Corsi[i].acquirenti[j]==msg.sender) return Corsi[i].link[j];
                }
            }
        }
    }

    function getNumeroAcquisti(uint256 idCorso) public view returns (uint256){
                for (uint256 i = 0; i < counter; i++) {
            if(Corsi[i].id>=0 && Corsi[i].id==idCorso) {
                return Corsi[i].numeroAcquisti;
            }
        }
    }

    
    function getAcquirenti(uint256 idCorso) public view returns (address[] memory){
                for (uint256 i = 0; i < counter; i++) {
            if(Corsi[i].id>=0 && Corsi[i].id==idCorso) {
                return Corsi[i].acquirenti;
            }
        }
    }
    
}