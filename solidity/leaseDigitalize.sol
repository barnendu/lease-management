pragma solidity ^0.4.18;

contract Owned{
    address owned;
    function Owned()public{
        owned = msg.sender;
    }
    modifier isOwned{
        require( msg.sender == owned);
        _;
    }
}

contract Lease is Owned{
    
    struct LeaseInfo{
        uint   propertyId;
        string propertyName;
        string addressI;
        bytes16 availableArea;
        bytes16 floor;
        uint suite;
        bytes16 askingRentMonthly;
        bytes16 dateAvailable;
        uint   leaseYears;
        string leaseTerm;
        bool   leaseConsignment;
       
    }
    struct LenalordInfo{
         string landLordname;
        string landlordEmail;
        bytes16 phoneNo;
    }
    
    mapping(address => LeaseInfo) leases;
    mapping(address => LenalordInfo) landlords;
    address[] public leaseAccnt;
   
    function createLease(
        address _address,
        uint  _id,
        string _propertyName,
        string _addressI,
        bytes16 _availableArea,
        bytes16 _floor,
        uint _suite,
        bytes16 _askingRentMonthly,
        bytes16 _dateAvailable,
        uint   _leaseYears,
        string _leaseTerm
        ) isOwned public returns(bool) {
        LeaseInfo storage lease = leases[_address];
        lease.propertyId = _id;
        lease.propertyName =_propertyName;
        lease.addressI =_addressI;
        lease.availableArea = _availableArea;
        lease.floor =_floor;
        lease.suite = _suite;
        lease.askingRentMonthly =_askingRentMonthly;
        lease.leaseYears =_leaseYears;
        lease.dateAvailable =_dateAvailable;
        lease.leaseTerm =_leaseTerm;
        leaseAccnt.push(_address);
        return(true);
        // leaseInfo( _id,_propertyName, _addressI,_availableArea,_floor ,_suite, _askingRentMonthly, _leaseYears,
        // _dateAvailable,
        // _leaseTerm);
    }
    
    function createLandlord(
    address _address,
    string _landLordname,
    string _landlordEmail,
    bytes16 _phoneNo
    )public payable{
       LenalordInfo storage landlord = landlords[_address]; 
       landlord.landLordname =_landLordname;
       landlord.landlordEmail =_landlordEmail;
       landlord.phoneNo =_phoneNo;
    }
    function getLease()  public constant returns(address[]){
        return(leaseAccnt);
    }
    
    function getLeaseDetails(address _address) public constant returns(uint,string , bytes16, bytes16, uint, bytes16, bytes16){
        return(leases[_address].propertyId,leases[_address].propertyName,leases[_address].availableArea,leases[_address].floor,leases[_address].suite,leases[_address].askingRentMonthly,leases[_address].dateAvailable);
    }
    
    function getLandlordDetails( address _address) public constant returns(string, string, bytes16) {
        return(landlords[_address].landLordname,landlords[_address].landlordEmail,landlords[_address].phoneNo);
    }
    
    function leaseCount() public constant returns(uint){
        return(leaseAccnt.length);
    }
    
}


