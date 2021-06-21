const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key')

const {User} = require('./models/user');

mongoose.connect(config.mongoURI,
                    {useNewUrlParser:true}).then(() =>console.log('DB connected.'))
                                            .catch(err => consolde.error(err));


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.post('/api/users/register', (req,res) => {
    const user = new User(req.body);

    user.save( (err,userData) => {
        if(err) return res.json({success:false, err})
    })

    return res.status(200).json({
        success:true
    })
})

app.post('/api/users/login',(req,res) =>{

    // search for email in the DB
    User.findOne({email: req.body.email}, (err,user)=>{
        if(!user)
        return res.json({
            loginSucess: false,
            message: "Auth failed, email not found"

        });

    // check if password is correct
    user.comparePassword(req.body.password, (err,isMatch) => {
        if(!isMatch){
            return res.json({loginSucess:false , message: "wrond password"})
        }
    })

    // generate token
    user.generateToken( (err,user) =>{
        if(err) return res.status(400).send(err);

        // create a cookie
        res.cookie("x_auth", user.token).status(200).json({loginSucess: true})

    })

    })
   
})

app.listen(4000);