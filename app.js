const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const con = require('./config/db');

const app = express();

// set the public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for session
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //1 day in millisec
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
    // config MemoryStore here
    store: new MemoryStore({
        checkPeriod: 24 * 60 * 60 * 1000 // prune expired entries every 24h
    })
}));

// ------------- Create hashed password --------------
app.get("/password/:pass", function (req, res) {
    const password = req.params.pass;
    const saltRounds = 10;    //the cost of encrypting see https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return res.status(500).send("Hashing error");
        }
        res.send(hash);
    });
});


// **root service (last service)
// localhost:3000
app.get('/', function(_req, res){
    //res.status(200).send('hello');
    res.sendFile(path.join(__dirname, 'Project_WebApp/viwes/index.html'));
});

// ==================User route==================================
// -----------------Register Page--------------------------------

app.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname,'Project_WebApp', 'views', 'register.html'));
});

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


// =================== Other routes =======================
// ------------- get user info --------------
app.get('/userInfo', function (req, res) {
    res.json({ "userID": req.session.userID, "username": req.session.username });
});

// ---------- login -----------
app.post('/login', function (req, res) {
    const { username, password } = req.body;
    const sql = "SELECT user_id, password, role FROM user WHERE username = ?";
    con.query(sql, [username], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.length != 1) {
            return res.status(401).send("Wrong username");
        }
        // check password
        bcrypt.compare(password, results[0].password, function (err, same) {
            if (err) {
                res.status(500).send("Server error");
            }
            else if (same) {
                // remember user
                req.session.userID = results[0].user_id;
                req.session.username = username;
                req.session.role = results[0].role;
                // role check
                if (results[0].role == 1) {
                    // admin
                    res.send('/admin/productPage');
                }
                else if (results[0].role == 2) {
                    // user
                    res.send('/user/productPage');
                }
            }
            else {
                res.status(401).send("Wrong password");
            }
        });
    });
});

// ------------- Logout --------------
app.get("/logout", function (req, res) {
    //clear session variable
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("Cannot clear session");
        }
        else {
            res.redirect("/");
        }
    });
});

// **config
// start sever
const PORT = 3000;
app.listen(PORT, function(){
    console.log('Sever is runnig at port ' + PORT)
});

// hello
