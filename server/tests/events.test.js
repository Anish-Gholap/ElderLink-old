const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Event = require('../models/event')
const helper = require('./test_helper')

const api = supertest(app)

describe('testing events returned from DB', () => {
  beforeEach(async () => {
    await Event.deleteMany({})
    await Event.insertMany(helper.initialEvents)
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
    const newEvent = {
      title: "Mahjong at Nanyang CC",
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs"
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
    const newEvent = {
      description: "Mahjong",
      dateTime: "21/01/25 14:00hrs"
    }

    await api
      .post('/api/events')
      .send(newEvent)
      .expect(400)

    const eventsAtEnd = await helper.eventsInDb()
    assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
