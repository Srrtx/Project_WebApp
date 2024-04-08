const express = require('express');
const path = require('path');
const con = require('./config/db');
const bcrypt = require('bcrypt');
const app = express();

//config
//set "public" folder to static folder
app.use(express.static(path.join(__dirname,'Project_WebApp')));

// allow json exchange
app.use(express.json());
// allow urlencoded exchange
app.use(express.urlencoded({extended:true}));

// root service (last service)
// localhost:3000
app.get('/', function(_req, res){
    //res.status(200).send('hello');
    res.sendFile(path.join(__dirname, 'Project_WebApp/viwes/index.html'));
});


// Register Page--------------------------------------------------------------------
//GET
app.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname,'Project_WebApp', 'views', 'register.html'));
});
// POST
app.post('/register', (req, res) => {
    const { username, password, confirmPassword, firstname, lastname } = req.body;
    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    // Registration store user in database
    // Respond with success message
    res.status(200).send('Registration successful');
});


// start sever
const PORT = 3000;
app.listen(PORT, function(){
    console.log('Sever is runnig at port ' + PORT)
});


