const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).populate('user', '-blogs')
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    try {
        const decodedToken = jwt.verify(request.token, config.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)


        const blog = new Blog({
            url: body.url,
            title: body.title,
            author: body.author,
            likes: body.likes || 0,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
    } catch (error) {
        //response.status(400).send(error.message)
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken) {
        return response.status(401).json({ error: 'token invalid' })
    }
    try {
        const blog = await Blog.findById(request.params.id)
        const user = await User.findById(decodedToken.id)
        if (blog.user.toString() === user.id.toString()) {
            await blog.remove()
            response.status(204).end()
        } else {
            response.status(401).json({ error: "not owner of blog" })
        }

    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
        content: body.content,
        important: body.important,
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter