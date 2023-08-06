if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}


// Libraries installed using npm command
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const initialisePassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');


initialisePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [];

app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true
}))



app.post('/register', async (req, res) => {
    try{
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        })
        console.log(users)
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
});

//Routes
app.get('/', (req, res) =>{
    res.render("index.ejs")
})

app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.get('/register', (req, res) => {
    res.render("register.ejs")
})
//End Routes

app.listen(3000)