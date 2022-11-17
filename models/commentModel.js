const {Schema, model} = require('mongoose');
const mongoose = require('mongoose');
const CommentSchema = new Schema({
    comment: {
        type: String,
        trim: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
{
    timestamps: true
}
);

module.exports = model('Comment', CommentSchema);