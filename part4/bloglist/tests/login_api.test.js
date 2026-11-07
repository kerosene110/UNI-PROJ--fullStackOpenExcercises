const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const test_case_user = new User({
        username: 'test_case_user',
        name: 'Test Case User',
        passwordHash: await bcrypt.hash('test_case_pw', 10)
    })
    await test_case_user.save()
})

test('Login success with 200 response', async () => {
    const loginInfo = {
        username: 'test_case_user',
        name: "Test Case User",
        password: 'test_case_pw'
    }

    response = await api
        .post('/api/login')
        .send(loginInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.deepStrictEqual(response.body.username, loginInfo.username)
    assert.deepStrictEqual(response.body.name, loginInfo.name)
    assert.ok(response.body.token)
})

test("login fail with response 401", async() => {
    const wrongCreds = {
        username: "test_case_user",
        password: "idk"
    }
    const result = await api
            .post('/api/login')
            .send(wrongCreds)
            .expect(401)
            .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
})

after(async () => {
    await mongoose.connection.close()
})