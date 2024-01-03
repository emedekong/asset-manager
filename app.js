const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
 
dotenv.config({path: './.env'});
const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.set('view engine', 'hbs');
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

db.connect((error) => {
    if(error) return console.log(error);
    console.log("DB Installed ... DB connected")
});

// app.get('/', (req, res) => {
//     //res.sendFile( __dirname+"/views/login.html"); 
//     res.render('index');
// });
app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(8003, ()=> {
    console.log("Listening on port 8003 ...");
});