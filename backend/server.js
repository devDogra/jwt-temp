const express = require('express'); 
const bcrypt = require('bcrypt'); 
const User = require("./UserModel"); 
const mongoose = require('mongoose'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1:27017/jwt100`'); 

const app = express(); 
app.use(express.json()); 
app.use(express.urlencoded()); 


app.post('/register', async (req, res) => {
    const { username, password } = req.body; 
    const newUser = await User.create({ username, password }); 
    res.send("Account registered"); 
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body; 
    const foundUser = await User.findOne({ username })
    if (!foundUser) return res.send("No such user");
    if (foundUser.password != password) return res.send("Incorrect pwd"); 

    const payload = {
        username,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
    res.send({
        msg: "Login successful",
        token,
    }); 
})

function verifyJWT() {
    const  token  = req.headers.authorization?.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next(); 
    } catch(err) {
        res.send("Invalid token"); 
        return; 
    }
}

app.post('/protected2', verifyJWT, (req, res) => {
    res.send("Blah"); 
})

app.post('/protected', verifyJWT, (req, res) => {
    const protectedData = 32949823; 
    res.send({protectedData}); 
})





app.listen(3000, () => {
    console.log("http://localhost:3000"); 
})