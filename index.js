    
const express = require('express');
const bodyParser = require('body-parser');
const Block  = require('./simpleChain');
const Blockchain = require('./simpleChain');
const app = express();

const Blockchain = new Blockchain();

app.use(bodyParser.json());

app.get('/block/:height', async (req, res) => {


return (await  res.json(Blockchain.getBlock(req.params)));
});

app.post('/block', async (req, res) => {
  
  await Blockchain.addBlock(new Block(req.body));
  return res.sendStatus(201);
});

const PORT = 8000;
app.listen(PORT, () => console.log(`App running port ${PORT}!`));