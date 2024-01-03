const mysql = require('mysql');
const bcrypt = require('bcrypt');

db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).render('login', {message: "Please provide an email and password to login!"});
        }

        db.query('SELECT * from asset_users where email = ?', [email], async(error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                return res.status(401).render('login', {message: "Email or Password is incorrect!"});
            }
        })
    }catch(error){
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    db.query('SELECT * FROM asset_users WHERE email = ?', [email], async(error, results) => {
        if(error){ 
            console.log(error);
            res.send("eeror occured");
        }
        if(results.length > 0 ){
            console.log(results);
            return res.render('register', {message: "Email is already registered"});  
        }else if(password != passwordConfirm){
            return res.render('register', { 
                message: "Passwords do not matach"
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT into asset_users set ?', {firstName: firstName, lastName: lastName, email: email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }else {
                console.log(results);
                return res.render('register', {message: "You have been registered!"});
            }
            
        });
    });
    //res.render('register', {message: "You have been registered"});

}

