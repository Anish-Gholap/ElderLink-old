const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Event = require('../models/event')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('testing events returned from DB', () => {
  beforeEach(async () => {
    await Event.deleteMany({})
    await User.deleteMany({})
    await Event.insertMany(helper.initialEvents)
    await User.insertMany(helper.initialUsers)
  })

  test('events are returned as JSON', async () => {
    await api
      .get('/api/events')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes returned', async () => {
    const response = await api.get('/api/events')
    assert.strictEqual(response.body.length, helper.initialEvents.length)
  })
})

describe('addition of a new event', () => {
  test('succeeds with valid data', async () => {
    const userId = await helper.getRandomUserId()
    
    const newEvent = {
      title: "Mahjong at Nanyang CC",
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs",
      userId: userId
    }

    await api
      .post('/api/events')
      .send(newEvent)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const eventsAtEnd = await helper.eventsInDb()
    assert.strictEqual(eventsAtEnd.length, helper.initialEvents.length + 1)

    const titles = eventsAtEnd.map(event => event.title)
    assert(titles.includes('Mahjong at Nanyang CC'))
  })

  test('fails with status code 400 if data invalid', async () => {
    const eventsAtStart = await helper.eventsInDb()
    const userId = await helper.getRandomUserId()
    
    const newEvent = {
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs",
      userId: userId
    }

    await api
      .post('/api/events')
      .send(newEvent)
      .expect(400)

    const eventsAtEnd = await helper.eventsInDb()
    assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)
  })
})

describe('when there is only one user in the db at the start', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
  })

  test('new user created with a different username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "anish",
      name: "Anish Gholap",
      password: "anish"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
