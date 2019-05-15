    
const express = require('express');
const bodyParser = require('body-parser');
const Block  = require('./simpleChain');
const Blockchain = require('./simpleChain');
const bitcoinLib = require('bitcoinjs-lib');
const bitcoinMsg = require('bitcoinjs-message');
const app = express();


app.use(bodyParser.json());

let mempool = [];
let timeoutRequests = [];
let starRes = [];

let delay = 400;

// let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)


app.get('/block/:height', async (req, res) => {


return (await  res.json(Blockchain.getBlock(req.params)));
});

app.post('/block', async (req, res) => {
  
  await Blockchain.addBlock(new Block(req.body));
  return res.sendStatus(201);
});

app.post("/requestValidation", async(req, res) => {
let address =  await req.body.address;
const TimeoutRequestsWindowTime = 5*60*1000;
let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
req.validationWindow = timeLeft;

timeoutRequests[request.walletAddress]=setTimeout(function(){
   self.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime );

 
 let response = {
   address: address,
   requestTimeStamp: `${getTime(new Date())}`,
   message: `[${adress}]:[timeStamp]:starRegistry`,
   validationWindow: timeLeft
 };

 res.json(response);

})

app.post("/message-signature/validate", async(req,res) => {
  let address = req.body.address;
  // let signiture = req.body.signature;
  let isValid = bitcoinMessage.verify(message, address, signature);

  res.send.json({
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1541605128",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
        "validationWindow": 200,
        "messageSignature": true
    }
  })
})

app.post("./block/:id", (req,res) => {
  let body = {
    address: req.body.address,
    star: {
              ra: RA,
              dec: DEC,
              mag: MAG,
              cen: CEN,
              story: Buffer(starStory).toString('hex')
      }
};
let block = new Block(body);
})

app.get("/block/[HEIGHT]", (req,res)=> {
  getLevelDBData(key){
    let self = this;
    return new Promise(function(resolve, reject) {
        self.db.get(key, (err, value) => {
            if(err){
                if (err.type == 'NotFoundError') {
                    resolve(undefined);
                }else {
                    console.log('Block ' + key + ' get failed', err);
                    reject(err);
                }
            }else {
                resolve(value);
            }
        });
    });
}
})

const PORT = 8000;
app.listen(PORT, () => console.log(`App running port ${PORT}!`));