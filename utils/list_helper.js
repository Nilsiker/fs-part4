/* eslint-disable no-console */
// const _ = require('lodash')

const dummy = (blogs) => {
    blogs = 1
    return blogs
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum += blog.likes
    })
    return sum
}

const favoriteBlog = (blogs) => {
    var fav = blogs[0]
    blogs.forEach(b => {
        if (b.likes > fav.likes)
            fav = b
    })
    return fav
}

// const mostBlogs = (blogs) => {

// }

// const mostLikes = (blogs) => {

// }

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    // mostBlogs,
    // mostLikes
}
