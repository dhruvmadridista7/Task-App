const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
    tokens : [{
        token : {
            type : String,
            required: true,
        }
    }],
})

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign( { _id : user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token : token });

    await user.save();
    return token;
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email: email } );

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema);


module.exports = User;