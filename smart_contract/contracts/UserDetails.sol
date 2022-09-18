// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract UserDetails{
    address public owner; 
    uint256 private counter; 


    constructor(){
        counter= 0;
        owner=msg.sender;
    }
   struct User{

        address user;    
        string username;
        string email;
        string hash;
   }

    event userCreated(
        address user,
        string username,
        string email,
        string hash
    );


   
    mapping(uint256 => User) users;
  

   function addUser(
        address user,
        string memory username,
        string memory email,
        string memory hash
   ) public{

        User storage newUser= users[counter];
        newUser.hash=hash;
        newUser.email=email;
        newUser.username=username;
        newUser.user=msg.sender;
        users[counter]= newUser;
        counter++;
        emit userCreated(user, username, email, hash);
   }

   function getUser(address userid) external view returns(string memory _users){
        uint256 j=0;
        for (uint256 i = 0; i < counter; i++) {
            if(users[i].user==userid) 
            {
                return(users[i].hash);
            }
        }
   }


   function changeDetails(string calldata oldHash,string calldata newHash,string calldata username,string calldata email) public returns(string memory)
   {
        for (uint256 i = 0; i <counter; i++) {
            if (keccak256(abi.encodePacked(users[i].hash)) == keccak256(abi.encodePacked(oldHash)))             
            {
                users[i].hash=newHash;
                users[i].username=username;
                users[i].email=email;
                return(users[i].hash);
            }
        }
   }
}