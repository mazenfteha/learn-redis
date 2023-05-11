const express = require('express');
const redis = require('redis');

const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)

const app = express()
app.use(express.json())

app.listen(3000, ()=>{
    console.log('server running on port 3000');
})