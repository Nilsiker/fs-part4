const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        minlength: 5
    },
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    author: {
        type: String,
        required: true,
        minlength: 5
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)