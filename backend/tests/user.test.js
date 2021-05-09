const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  await request(app).post('/users').send({
    name: 'Donde Ska222',
    email: 'dondeska@gmail.com',
    password: 'Test12345!'
  }).expect(201)
})

test('Shoud log in existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  //fetch the user from database
  const user = await User.findById(userOneId)
  const responseSecondToken = response.body.token

  expect(user.tokens[1].token).toBe(responseSecondToken)

})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'userone@testmail.com',
    password: 'onetwoThree'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthorized user', async () => {
  await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/img-test.jpg')
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should updated valid user fields', async () => {
  const response = await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'TestNameWasChanged'
    }).expect(200)

  expect(response.body.name).toEqual('TestNameWasChanged')
})

test('Should not update invalid user fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Los angeles'
    }).expect(400)
})

