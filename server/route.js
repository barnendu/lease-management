const bodyParser = require("body-parser"),
  EthUtil = require("ethereumjs-util"),
  User = require("../model/userModel"),
  crypto = require("crypto"),
  fs = require('fs'),
  RSA = require("keypair"),
  jwt = require("jsonwebtoken"),
  express = require("express"),
  path = require("path"),
  leaseController = require("./leaseController");
var secureRoutes = express.Router();
module.exports = function (app) {
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // parse application/json 
  app.use(bodyParser.json())

  app.all('/', function (req, res) {
    var __dirname = './public/pages/';
    res.sendFile('index.html', {
      root: __dirname
    });
  });
  //============= secure routes==============//
  app.use('/secure-api', secureRoutes);
  secureRoutes.use((req, res, next) => {
    var token = req.body.token || req.headers['token'];
    if (token) {
      //  console.log("token : " + token)
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err)
          res.status(500).send("send a valid token");
        else
          next();
      })
    } else {
      res.send("please send a token");
    }
  })
  //=================//
  app.post('/sign', function (req, res) {
    console.log(req.body.key);

    var privateKeyPath = path.join(__dirname, 'privateKeys', req.body.signedMsg.uname + '.pem')
    var privateKey = fs.readFileSync(privateKeyPath)
    //console.log(privateKey.toString("utf8"));

    var result = crypto.publicEncrypt({
      key: req.body.key.toString("utf8")
    }, Buffer.from(req.body.signedMsg.uname));

    // <Crypted Buffer> 
    var plaintext = crypto.privateDecrypt({
      key: privateKey.toString("utf8")
    }, result);
    console.log(plaintext.toString('utf8'));
    if (req.body.signedMsg.uname == plaintext) {
      User.find({
        $and: [{
          "userName": req.body.signedMsg.uname
        }, {
          "password": req.body.signedMsg.password
        }]
      }, function (err, data) {
        if (err) {
          res.status(500).send("Please login with correct credential.")
        } else {
          var token = jwt.sign({
            "user": req.body.signedMsg.uname
          }, process.env.SECRET_KEY, {
            expiresIn: 3600
          });
          res.json({
            success: true,
            token: token,
            msg: data[0]
          })
        }
      });
    } else {
      res.status(500).send("Please login with correct credential.")
    }
    // const msg = new Buffer(req.body.msg);
    // const sig = web3.eth.sign(web3.eth.accounts[0], '0x' + msg.toString('hex'));
    // const {v, r, s} = EthUtil.fromRpcSig(sig);

    // const prefix = new Buffer("\x19Ethereum Signed Message:\n");
    // const prefixedMsg = EthUtil.sha3(
    //   Buffer.concat([prefix, new Buffer(String(msg.length)), msg])
    // );

    // const pubKey  = EthUtil.ecrecover(prefixedMsg, v, r, s);
    // const addrBuf = EthUtil.pubToAddress(pubKey);
    // const addr    = EthUtil.bufferToHex(addrBuf);

    // console.log(web3.eth.accounts[0],  addr);
  })
  //======================== user registration ===================//
  app.post('/register', (req, res) => {
    // console.log(req.body)
    var user = new User(req.body)
    user.save(function (err, data) {
      if (err) {
        res.status(500).send("Some error occoured")
      } else {

        const keys = new RSA();
        res.send(Buffer.from(keys.public));
        var privateKeyPath = path.join(__dirname, 'privateKeys', req.body.userName + '.pem')
        fs.writeFileSync(privateKeyPath, keys.private, 'ascii', function (err) {
          console.log("err:" + err);
        })
      }
    })
  });
  //======================== Asset Registration ===================//
  secureRoutes.post('/lease-create', leaseController);

}