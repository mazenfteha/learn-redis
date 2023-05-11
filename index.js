const express = require('express');
const redis = require('redis');

const util =require('util')

const REDIS_PORT = 6379;

const client = redis.createClient({
    legacyMode: true,
    PORT: REDIS_PORT
});

client
    .connect()
    .then(async () => {
        console.log("You are connected")
})
    .catch((err) => {
        console.log("error happened", err)
});

client.set = util.promisify(client.set)
client.get = util.promisify(client.get)

const app = express()
app.use(express.json())

app.post('/', async (req, res) =>{
    const { key, value } = req.body ;
    const response = await client.set(key, value)
    res.json(response)
})

app.get('/', async (req, res) => {
    const { key } = req.body
    const value = await client.get(key)
    res.json(value)
})

app.listen(3000, ()=>{
    console.log('server running on port 3000');
})