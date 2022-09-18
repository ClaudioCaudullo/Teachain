// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Reviews {
    address public owner; 
    uint256 private counter; 

    constructor(){
        counter= 0;
        owner=msg.sender;
    }

    struct review{
        address creator;
        address reviewed;
        uint256 id;    
        string hash;
    }

    event reviewCreated(
        address creator,
        address reviewed,
        uint256 id,
        string hash
    );

    mapping(uint256 => review) reviews;

    function addReview(
        string memory _postHash,
        address reviewed
    ) public {
        review storage newReview= reviews[counter];
        newReview.hash=_postHash;
        newReview.id= counter;
        newReview.creator=msg.sender;
        newReview.reviewed=reviewed;
        reviews[counter]= newReview;
        counter++;
        emit reviewCreated(
            msg.sender,
            reviewed,
            counter,
            _postHash
        );
    }

    function getReviewNumber() public view returns(uint256)
    {
        return counter;
    }

    function getReview(uint256 id) public view returns(
        string memory,
        address){
            require(id<counter, "Non esiste un corso con questo id");
            review storage c= reviews[id];
            return(c.hash,c.creator);
    }

    function getAllReview() external view returns (review[] memory _reviews) {
        _reviews = new review[](counter);
        for (uint256 i = 0; i < _reviews.length; i++) {
            _reviews[i] = reviews[i];
        }
    }

    function getAllReviewByUserId(address userid) external view returns (review[] memory _reviews) {
        _reviews = new review[](counter);
        uint256 j=0;
        for (uint256 i = 0; i < _reviews.length; i++) {
            if(reviews[i].reviewed==userid) 
            {
                _reviews[j] = reviews[i];
                j++;
            }
        }
        return _reviews;
    }

        function changeReview(string calldata oldHash,string calldata newHash) public returns(string memory){
        for (uint256 i = 0; i <counter; i++) {
            if (reviews[i].id>=0 && (keccak256(abi.encodePacked(reviews[i].hash)) == keccak256(abi.encodePacked(oldHash))))             
            {
                reviews[i].hash=newHash;
                return(reviews[i].hash);
            }
        }
    }


    function deleteReview(uint256 idReview) public {
        for (uint256 i = 0; i < counter; i++) {
            if(reviews[i].id>=0 && reviews[i].id==idReview) {
                reviews[i].hash="-1";
                return;
            }
        }
    }
    
}