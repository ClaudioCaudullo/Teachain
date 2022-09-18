// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Courses {
    address public owner;
    uint256 private counter;

    constructor(){
        counter= 0;
        owner=msg.sender;
    }

    struct course{
        address creator;
        uint256 id;    
        string hash;
        address[] buyer;
        string[] link;
        uint256 numberOfBuyer;
    }

    event courseCreated(
        address creator,
        uint256 id,
        string hash,
        uint256 numberOfBuyer
    );

    mapping(uint256 => course) courses;

    function addCourse(
        string memory _postHash
    ) public payable {
        course storage newCourse= courses[counter];
        newCourse.hash=_postHash;
        newCourse.id= counter;
        newCourse.creator=msg.sender;
        newCourse.numberOfBuyer=0;
        courses[counter]= newCourse;
        counter++;
        emit courseCreated(
            msg.sender,
            counter,
            _postHash,
            0
        );
    }

    function getCoursesNumber() public view returns(uint256)
    {
        return counter;
    }

    function getCourse(uint256 id) public view returns(
        string memory,
        address){
            require(id<counter, "Non esiste un course con questo id");
            course storage c=courses[id];
            return(c.hash,c.creator);
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

    function getCourseByHash(string calldata hashCourse) public view returns(
        string memory){
            for (uint256 i = 0; i < counter; i++) {
            if((keccak256(abi.encodePacked(courses[i].hash)) != "-1") && (keccak256(abi.encodePacked(courses[i].hash)) == (keccak256(abi.encodePacked(hashCourse))))) 
            {
                return(uint2str(courses[i].id));
            }
        }
            return("-1");
    }

    function getAllCourses() external view returns (course[] memory _courses) {
        _courses = new course[](counter);
        for (uint256 i = 0; i < _courses.length; i++) {
            if((keccak256(abi.encodePacked(courses[i].hash)) != "-1")) _courses[i] = courses[i];
        }
    }



    function getAllCoursesByUserId(address userid) external view returns (course[] memory _courses) {
        _courses = new course[](counter);
        uint256 j=0;
        for (uint256 i = 0; i < _courses.length; i++) {
            if((keccak256(abi.encodePacked(courses[i].hash)) != "-1") && courses[i].creator==userid) 
            {
                _courses[j] = courses[i];
                j++;
            }
        }
        return _courses;
    }

    function modifyCourse(string calldata oldHash,string calldata newHash) public returns(string memory){
        for (uint256 i = 0; i <counter; i++) {
            if (courses[i].id>=0 && (keccak256(abi.encodePacked(courses[i].hash)) == keccak256(abi.encodePacked(oldHash))))             
            {
                courses[i].hash=newHash;
                return(courses[i].hash);
            }
        }
    }

    function deleteCourse(uint256 idCourse) public {
        for (uint256 i = 0; i < counter; i++) {
            if(courses[i].id>=0 && courses[i].id==idCourse) {
                courses[i].hash="-1";
                return;
            }
        }
    }

    function addPurchase(uint256 idCourse,address buyer,string calldata link) public{
        for (uint256 i = 0; i < counter; i++) {
            if(courses[i].id>=0 && courses[i].id==idCourse) {
                courses[i].buyer.push(buyer);
                courses[i].numberOfBuyer++;
                courses[i].link.push(link);
            }
        }
    }

    function getPurchase(uint256 idCourse) public view returns(string memory){
        for(uint256 i=0;i<counter;i++)
        {
            if(courses[i].id>=0 && courses[i].id==idCourse)
            {
                for(uint256 j=0;j<courses[i].buyer.length;j++)
                {
                    if(courses[i].buyer[j]==msg.sender) return courses[i].link[j];
                }
            }
        }
    }

    function getNumberPurchase(uint256 idCourse) public view returns (uint256){
                for (uint256 i = 0; i < counter; i++) {
            if(courses[i].id>=0 && courses[i].id==idCourse) {
                return courses[i].numberOfBuyer;
            }
        }
    }

    
    function getBuyer(uint256 idCourse) public view returns (address[] memory){
                for (uint256 i = 0; i < counter; i++) {
            if(courses[i].id>=0 && courses[i].id==idCourse) {
                return courses[i].buyer;
            }
        }
    }
    
}