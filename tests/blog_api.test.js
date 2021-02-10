const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')

const api = supertest(app)

var toRemove = null

const blogs = [
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0, user: "5e1c67df48f4b72350a76f61" },
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0, user: "5e1c67df48f4b72350a76f61" },
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0, user: "5e1c67df48f4b72350a76f61" },
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0, user: "5e1c67df48f4b72350a76f61" },
    { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0, user: "5e1c67df48f4b72350a76f61" },
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0, user: "5e1c67df48f4b72350a76f61" }
]

const USER = {
    username: "testuser",
    password: "password"
}

const OTHER_USER = {
    username: "otheruser",
    password: "password"
}

beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const blog0 = new Blog(blogs[0])
    const blog1 = new Blog(blogs[1])
    await blog0.save()
    await blog1.save()

    await api
        .post('/api/users')
        .send(USER)
    await api
        .post('/api/users')
        .send(OTHER_USER)
})

describe('get requests', () => {
    test('blogs are returned as json', async () => {
        const blogRes = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(blogRes.body.length === 2)
    })
    test('users are returned as json', async () => {
        const userRes = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(userRes.body.length === 2)
    })
})

describe('post requests', () => {
    test('add blog without token', async () => {
        await api
            .post('/api/blogs')
            .send(blogs[0])
            .expect(401)
    })

    test('add blog with token', async () => {
        const tokenres = await api
            .post('/api/login')
            .send(USER)

        const blogres = await api
            .post('/api/blogs')
            .send(blogs[0])
            .set('Authorization', 'bearer ' + tokenres.body.token)
            .expect(200)
        expect(blogres.body === blogs[0])
        toRemove = blogres.body.id
    })

    test('adding blog without title returns 400', async () => {
        const tokenres = await api
            .post('/api/login')
            .send(USER)

        const clone = { ...blogs[0] }
        delete clone.title
        await api
            .post('/api/blogs')
            .send(clone)
            .set('Authorization', 'bearer ' + tokenres.body.token)
            .expect(400)

    })

    test('adding blog without author returns 400', async () => {
        const tokenres = await api
            .post('/api/login')
            .send(USER)

        const clone = { ...blogs[0] }
        delete clone.author
        await api
            .post('/api/blogs')
            .send(clone)
            .set('Authorization', 'bearer ' + tokenres.body.token)
            .expect(400)
    })
})


describe('delete requests', () => {
    test('remove other users blog', async () => {
        const tokenres = await api
            .post('/api/login')
            .send(OTHER_USER)

        await api
            .delete(`/api/blogs/${toRemove}`)
            .set('Authorization', 'bearer ' + tokenres.body.token)
            .expect(401)
    })

    test('remove own blog', async () => {
        const tokenres = await api
            .post('/api/login')
            .send(USER)

        await api
            .delete(`/api/blogs/${toRemove}`)
            .set('Authorization', 'bearer ' + tokenres.body.token)
            .expect(204)
    })
})



afterAll(() => {
    mongoose.connection.close()
})