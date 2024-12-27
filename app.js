require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { AuthController, checkToken } = require('./controller');
const app = express();

// Config JSON response
app.use(express.json());

// Credentials
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;
const linkConnect = `mongodb+srv://${dbuser}:${dbpass}@authcluster.zg0ujac.mongodb.net/?retryWrites=true&w=majority&appName=AuthCluster`;

mongoose.connect(linkConnect)
    .then(() => {
        console.log('Conectou ao Banco');
        app.listen(8080);
    })
    .catch((err) => { console.log(err); });

// Public route
app.get('/', AuthController.welcome);

// Private route
app.get('/user/:id', checkToken, AuthController.getUser);

// Register user
app.post('/auth/register', AuthController.registerUser);

// Login user
app.post('/auth/login', AuthController.loginUser);