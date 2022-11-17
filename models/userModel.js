const {Schema, model} = require('mongoose');

const User = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        require: true, 
        index:true, 
        nique:true,
        sparse:true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String, 
},
{
    timestamps: true
}
);

module.exports = model('User', User);