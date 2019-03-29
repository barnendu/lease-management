'use strict';
const CryptoJS = require('crypto-js'),
 EC = require('elliptic').ec,
 Web3 = require("web3"),
 ec = new EC('secp256k1');

 var web3 = new Web3();
 web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

module.exports=function(req,res){
//console.log(req.body);
var request=req.body.msg;
//========== generate property address ====//
var privKey= request.propertyName+' '+request.address+' '+request.floor;
var keyPair = ec.genKeyPair();
keyPair._importPrivate(privKey, 'hex');
var compact = false;
var pubKey = keyPair.getPublic(compact, 'hex').slice(2);
var pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);
var hash = CryptoJS.SHA3(pubKeyWordArray, { outputLength: 256 });
var address = '0x'+hash.toString(CryptoJS.enc.Hex).slice(24);
console.log(address);
var abi =[{"constant":true,"inputs":[],"name":"leaseCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"leaseAccnt","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getLeaseDetails","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bytes16"},{"name":"","type":"bytes16"},{"name":"","type":"uint256"},{"name":"","type":"bytes16"},{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getLease","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getLandlordDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_landLordname","type":"string"},{"name":"_landlordEmail","type":"string"},{"name":"_phoneNo","type":"bytes16"}],"name":"createLandlord","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_id","type":"uint256"},{"name":"_propertyName","type":"string"},{"name":"_addressI","type":"string"},{"name":"_availableArea","type":"bytes16"},{"name":"_floor","type":"bytes16"},{"name":"_suite","type":"uint256"},{"name":"_askingRentMonthly","type":"bytes16"},{"name":"_dateAvailable","type":"bytes16"},{"name":"_leaseYears","type":"uint256"},{"name":"_leaseTerm","type":"string"}],"name":"createLease","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var leaseContract = web3.eth.contract(abi);
var leaseInstance = leaseContract.at('0x6b2c326be2aeb257e136ed75f580fa21da770544');
//  console.log(address.toString(),parseInt(request.propertId),request.propertyName.toString(),
// request.address.toString(),web3.fromAscii(request.availArea),web3.fromAscii(request.floor),parseInt(request.suite),web3.fromAscii(request.rentMonthly),
// web3.fromAscii(request.dateAvail),parseInt(request.minYear),request.term.toString());
web3.personal.unlockAccount(web3.eth.accounts[0],"", 15000) // unlock account for 15000 second while comit trasection.
var flag=leaseInstance.createLease(address,request.propertId,request.propertyName,
request.address,web3.fromAscii(request.availArea),web3.fromAscii(request.floor),request.suite,web3.fromAscii(request.rentMonthly),
web3.fromAscii(request.dateAvail),request.minYear,request.term,{from: web3.eth.accounts[0], gas:3000000});
console.log(flag)
leaseInstance.createLandlord(address,request.landLordName,request.landlordEmail,web3.fromAscii(request.landLordPhno),{from: web3.eth.accounts[0], gas:3000000});
res.send({msg:"Lease created sucessfully" , status:flag});
}