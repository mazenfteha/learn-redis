const express = require('express');
const redis = require('redis');
const axios = require('axios')

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

//JSON placeholder api
app.get('/posts/:id', async (req,res) => {
    const { id } = req.params

    const cachedPost = await client.get(`post-${id}`)

    if(cachedPost){
        return res.json(JSON.parse(cachedPost))
    }

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
    client.set(`post-${id}`, JSON.stringify(response.data), "EX", 10)

    return res.json(response.data)
})

app.listen(3000, ()=>{
    console.log('server running on port 3000');
})