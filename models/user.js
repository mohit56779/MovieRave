const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { text } = require('body-parser');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 30
    },

    email:{
        type:String,
        trim:true,
        unque:1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength:30
    },
    role : {
        type:Number,
        default:0
    },
    token:{
        type:String,
    },
    tokenExp:{
        type: Number
    }

})

userSchema.pre('save', function(next){
    var user = this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next()
            })
            
        })

        } else{
            next()
        }
    
});

userSchema.methods.comparePassword = function(textpassword, callbackFn){
    bcrypt.compare(textpassword, this.password, function(err,isMatch){
        if(err) return callbackFn(err);
        callbackFn(null,isMatch)
    })
}

userSchema.methods.generateToken = function(callbackFn){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secret')
    user.token = token;
    user.save(function(err,user){
        if(err) return callbackFn(err);
        callbackFn(null,user);
    })
}

userSchema.statics.findByToken = function(token, callbackFn){

    var user = this;

    jwt.verify(token, 'secret', function(err, decode){
        user.findOne( {"_id": decode, "token": token}, function(err,user){
            if(err) return callbackFn(err);
            callbackFn(null,user);

        })


    })

}

const User = mongoose.model('User', userSchema)

module.exports = { User }