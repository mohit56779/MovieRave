const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {User} = require('./models/user');

mongoose.connect('mongodb+srv://mohit56779:mohit1234@movierave.cbrl8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.listen(4200);