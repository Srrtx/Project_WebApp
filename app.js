const express = require('express');
const path = require('path');
const con = require('./config/db');
const bcrypt = require('bcrypt');
const app = express();

//config
//set "public" folder to static folder
//app.use("/public", express.static(path.join(__dirname, 'Project_WebApp/public')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Project_WebApp', 'views')));
// allow json exchange
app.use(express.json());
// allow urlencoded exchange
app.use(express.urlencoded({extended:true}));

// generate hashed password
app.get('/password/:raw', function(req, res){
    const raw = req.params.raw;
    bcrypt.hash(raw, 10, function(err, hash){
        if(err){
            console.error(err);
            res.status(500).send('Server error');
        } else{
            
            res.status(200).send(hash);
        }
    });
});

// login
app.post('/login',function(req,res){
    //get username and password
    const username = req.body.username;
    const raw_password = req.body.password;
    //console.log(username,password);
    const sql = "SELECT id,role,password FROM users WHERE username =?";
    con.query(sql, [username], function(err, results){
        if(err){
            console.error(err);
            res.status(500).send('Sever error');
        }
        else{
            if(results.length == 0){
                // wrong login
                res.status(401).send('login fail: username is wrong');
            }
            else{
                // username is found, check password
                const hash = results[0].password;
                // console.log(hash);
                // res.send();
                bcrypt.compare(raw_password, hash, function(err, same){
                    if(err){
                        console.error(err);
                        res.status(500).send('Server error');
                    }else{
                        if(same){
                            res.status(200).send('Login Ok');
                        }
                        else{
                            res.status(401).send('login fail: wrong password');
                        }
                    }
                });
            }
        }
    });
});

//-----------------------------------------------------------------------------
//login page
app.get('/login', function(_req, res){
    //res.status(200).send('hello');
    res.sendFile(path.join(__dirname, 'Project_WebApp/viwes/login.html'));
});

// root service (last service)
// localhost:3000
app.get('/', function(_req, res){
    //res.status(200).send('hello');
    res.sendFile(path.join(__dirname, 'Project_WebApp/viwes/index.html'));
});

// Register Page--------------------------------------------------------------------
//GET
app.get('/signup', (req,res) => {
    //res.sendFile(path.join(__dirname, 'Project_WebApp/viwes/register.html'));
    res.sendFile(path.join(__dirname, 'Project_WebApp', 'views', 'register.html'));
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


