    
const express = require('express');
const bodyParser = require('body-parser');
// const Blockchain = require('./simpleChain');
const bitcoinLib = require('bitcoinjs-lib');
const bitcoinMsg = require('bitcoinjs-message');
const app = express();
// const Block = require("./simpleChain");
const myUtils = require("./simpleChain")
const Blockchain = myUtils.Blockchain;
const Block = myUtils.Block;

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
        let currenttime = new Date().getTime().toString().slice(0,-3);
        let twindows = currenttime-memPool[address].requestTimeStamp-300;
        twindows <0?memPool[address].validationWindow = - twindows: delete memPool[address];
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

// app.post("/message-signature/validate", (req,res) => {
//     let address =  req.body.address;
//   console.log(req.body)
//   let signature =  req.body.signature;
//   let message =  req.body.message;
//     // let sign =  bitcoinMsg.verify(message, address, signature);
//     console.log(req.body)
//     res.send({signature,message})
//   res.json({
//     "registerStar": true,
//     "status": {
//         "address": address,
//         "requestTimeStamp": Date.now,
//         "message": {adress: adress, signature: signature},
//         "validationWindow": 200,
//         "messageSignature": sign
        
//     }
    
//   })
// res.json({status: "works"})
// })

// POST request with address, signature, and message to verify identity
app.post("/message-signature/validate",(req,res)=>{
    const{address,signature} = req.body;
 
    if(!address.trim() || !signature.trim()) {
        res.json("Please,provide address and/or signiture")
    }
 
    if(memPool[address]) {
        let currenttime = new Date().getTime().toString().slice(0,-3);
        let twindows = currenttime-memPool[address].requestTimeStamp-300;
 
        if(twindows > 0){
            delete memPool[address];
            res.json("Waiting time exceeded 5 minutes; try again, please!")
        } else {
            const verificationResponse ={
                registerStar: bitcoinMsg.verify(memPool[address].message, address, signature),
                status: {
                    messageSignature: bitcoinMsg.verify(memPool[address].message, address, signature),
                    address,
                    signature,
                    message:memPool.message,
                    validationWindow:-twindows,
                    requestTimeStamp:memPool[address].requestTimeStamp
 
                }
            };
            memPool[address].messageSignature = verificationResponse.status.messageSignature;
            res.json(verificationResponse);
        }
    }
    res.json(`There is no such approved address as ${address}.`);
 
 })

app.post("/block", async (req,res) => {
//    const address = req.body.address
   const{address,star} = req.body;
    if(!(star && star.dec && star.ra && star.story)){
    return res.json("not enough data provided");
}
  
  if(!memPool[address] || !memPool[address].messageSignature) {
        return res.json(`Your address is not validated`);
    }

    star.story = Buffer.from(star.story, "ascii").toString("hex");
    const notaryData = {
        address,
        star
    }
    
    // let notaryData = {
    //     address: req.body.address,
    //     star: {
    //               ra: req.star.ra,
    //               dec: req.star.dec,
    //               mag: req.star.mag,
    //               cen: req.star.cen,
    //               story: Buffer(req.star.story).toString('hex')
    //       }
    //     }
    minedBlock.body.star.storyDecoded = Buffer.from(minedBlock.body.star.story, 'hex').toString();
    delete memPool[address];
    
    res.json(minedBlock)

    
    

})

app.get("/block/:height", async (req, res) => {
    if(req.params.height) {
        const height = parseInt(req.params.height);


       let block = await blockchain.getBlock(req.params.height);
       if(block){
        block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString();
            return res.status(200).json(block);
        } else {
            return res.status(404).send("Block Not Found!");
        }
    } else {
        return res.status(404).send("Block Not Found! Review the Parameters!");
    }

});

app.get("/stars/address::address", async (req, res) => {
    const address = req.params.address;
    try {
        let blocks = await blockchain.getBlocksByAddress(address);
        return res.status(200).json(blocks);
    } catch (e) {
        console.log(e);
        return res.status(404).send("Blocks Not Found!");
    }
});


app.get("/stars/hash::hash", async (req, res) => {
    const hash = req.params.hash
    try {
        let block = await blockchain.getBlockByHash(hash);
        return res.status(200).json(block);
    } catch (e) {
        console.log(e);
        return res.status(404).send("Block Not Found!");
    }
});


const PORT = 8080;
app.listen(PORT, () => console.log(`App running port ${PORT}!`));