const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Event = require('../models/event')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

// global variables to store for each test
let token, id 

// populate test database for each test
beforeEach(async () => {
  await Event.deleteMany({})
  await User.deleteMany({})
  await Event.insertMany(helper.initialEvents)

  const passwordHash = await bcrypt.hash('eventsTest', 10)
  const user = new User({
    username: 'eventsTest',
    passwordHash: passwordHash
  })

  await user.save()

  console.log('DEBUG: ',user.username, ' added to DB')
})

afterEach(async () => {
  const users = await helper.usersInDb()
  console.log('DEBUG: User Currently in DB:')
  await users.forEach((user) => console.log(user.username))
})

// test login 
describe('HTTP POST /login', () => {
  test('authenticate user', async () => {
    const user = {
      username: 'eventsTest',
      password: 'eventsTest'
    }

    const response = await api.post('/api/login').send(user).expect(200)
    token = response.body.token
  })
})

// test getting events from DB
describe('testing GET request to /api/events', () => {
  test('events are returned as JSON', async () => {
    await api
      .get('/api/events')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs returned', async () => {
    const response = await api.get('/api/events')
    assert.strictEqual(response.body.length, helper.initialEvents.length)
  })
})

// test adding events to DB
describe('testing PUT request to /api/events', () => {
  test('succeeds with valid data', async () => {
    const newEvent = {
      title: "Mahjong at Nanyang CC",
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs",
    }

    // login using test user and receive token generated for user
    const response = await api
      .post('/api/login')
      .send({
        username: 'eventsTest',
        password: 'eventsTest'
      })
      .expect(200)

    //send data using token received to approve creation
    await api
      .post('/api/events')
      .send(newEvent)
      .set('Authorization', `Bearer ${response.body.token}`) // set authorization header to token to allow event creation
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const eventsAtEnd = await helper.eventsInDb()
    assert.strictEqual(eventsAtEnd.length, helper.initialEvents.length + 1)

    const titles = eventsAtEnd.map(event => event.title)
    assert(titles.includes('Mahjong at Nanyang CC'))
  })

  test('fails with status code 400 if data invalid', async () => {
    const eventsAtStart = await helper.eventsInDb()
    
    const newEvent = {
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs"
    }

    // login using test user
    const response = await api
      .post('/api/login')
      .send({
        username: 'eventsTest',
        password: 'eventsTest'
      })
      .expect(200)

    await api
      .post('/api/events')
      .send(newEvent)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(400)

    const eventsAtEnd = await helper.eventsInDb()
    assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)
  })
})

describe("removing event from database", () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const tempEvent = {
      title: "tempEvent",
      description: "tempEvent",
      dateTime: "21/01/25 14:00hrs",
    }

    const response = await api
      .post('/api/login')
      .send({
        username: 'eventsTest',
        password: 'eventsTest'
      })
      .expect(200)

    await api
      .post('/api/events')
      .send(tempEvent)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)

    const eventsAtStart = await Event.find({})
    const eventToDelete = eventsAtStart[eventsAtStart.length - 1]

    await api
      .delete(`/api/events/${eventToDelete._id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204)

    const eventsAtEnd = await Event.find({})
    assert.strictEqual(eventsAtEnd.length, eventsAtStart.length - 1)

    const titles = eventsAtEnd.map(event => event.title)
    assert(!(titles.includes(tempEvent.title)))
  })
})

after(async () => {
  await mongoose.connection.close()
})
