    
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const bitcoinLib = require('bitcoinjs-lib');
const bitcoinMsg = require('bitcoinjs-message');
const app = express();


app.use(bodyParser.json());

let memPool = [];
let timeoutRequests = [];
let starRes = [];

let delay = 400;

let blockchain = new Blockchain();

// let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
// let BlockChain = await new  Blockchain()
//This route handler sends a request using the block height to recieve a json response of the block.
//I expect to see the entire Block content such as the hash height body time and prevhash.
// app.get('/block/blockHeight',  (req, res) => {
// res.json(Blockchain.getBlock(req.params.blockHeight))
// getBlockByHeight() 

// const decode = (block) => {
//     let story 
// }
// function decode_story_filter(block) {
//     if ('star' in block && 'story' in block.star) {
//       let story = block.star.story;
//       const buf = Buffer.from(story, 'hex');
//       block.star.storyDecoded = buf.toString('ascii');
//     }
//     return block;
//   }
    app.get("/block/:height", async (req, res) => {
        if(req.params.height) {
            const height = parseInt(req.params.height);


           let block = await blockchain.getBlock(req.params.height);
           if(block){
               block.height.body =  Buffer.from(block.body,"hex").toString();
                return res.status(200).json(block);
            } else {
                return res.status(404).send("Block Not Found!");
            }
        } else {
            return res.status(404).send("Block Not Found! Review the Parameters!");
        }

    });


//  res.send(json(Blockchain.getBlock(req.params)));
// });



// app.post('/addblock', async (req, res) => {
  
//  const newBlock =  await Blockchain.addBlock(new Block(req.body));
//   return res.send(newBlock);
// });


app.post("/requestValidation",(req,res)=>{
    
    let address = req.body.address;
    if(!address.trim()){
        res.json("Please,provide valid address");
    }
 
    if(!memPool[address]){
        let requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        let message = `${address}:${requestTimeStamp}:starRegistry`;
 
        memPool[address] = {
            address,
            requestTimeStamp,
            message,
            validationWindow:300,
        };
    } else {
        // adjust validationRequest
        let timeNow = new Date().getTime().toString().slice(0,-3);
        let timeWindow = timeNow-memPool[address].requestTimeStamp-300;
        timeWindow <0?memPool[address].validationWindow = - timeWindow: delete memPool[address];
    }
 
    memPool[address]?res.json(memPool[address]):res.json("Repeat validation request");
 
 });
// app.post("/requestValidation", async(req, res) => {
// //variable that grabs the address of the post request
// let address =  await req.body.address;
// const TimeoutRequestsWindowTime = Date.now() - (5 * 60 * 1000)
// let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
// let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;

// const timestamp = Date.now()

// let response = {
//   address: address,
//   requestTimeStamp: `${(new Date())}`,
//   message: `[${adress}]:${timeStamp}:starRegistry`,
//   validationWindow: timeLeft
// };

// res.send.json(response);


// res.send("hello express")

// app.post("/requestValidation", async(req, res) => {
  
// let addingBlock = new Promise(function(resolve,reject){
//     resolve(  blockchain.addBlock(block))

// reject(err)
//     console.log(err)

// }
// )

// addingBlock.then((address)=> {

// })
 
// // variable that grabs the address of the post request    
// let address =  await req.body.address;
// const TimeoutRequestsWindowTime = Date.now() - (5 * 60 * 1000)
// let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
// let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;

// const requestTimeStamp = Date.now()
 
//  let response = {
//    address: address,
//    requestTimeStamp: `${(new Date())}`,
//    message: `[${address}]:${requestTimeStamp}:starRegistry`,
//    validationWindow: timeLeft
//  };

//  res.send.json(response);

// })

app.post("/message-signature/validate", async(req,res) => {
  let address = req.body.address;
  // let signiture = req.body.signature;
  let sign = bitcoinMsg.verify(message, address, signature);

  res.send.json({
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1541605128",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
        "validationWindow": 200,
        "messageSignature": sign
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

// app.get("/block/[HEIGHT]", (req,res)=> {
//   getLevelDBData = (key) => {
//     let self = this;
//     return new Promise(function(resolve, reject) {
//         self.db.get(key, (err, value) => {
//             if(err){
//                 if (err.type == 'NotFoundError') {
//                     resolve(undefined);
//                 }else {
//                     console.log('Block ' + key + ' get failed', err);
//                     reject(err);
//                 }
//             }else {
//                 resolve(value);
//             }
//         });
//     });
// }
// })

const PORT = 8080;
app.listen(PORT, () => console.log(`App running port ${PORT}!`));