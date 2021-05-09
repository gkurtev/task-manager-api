const app = require('../src/app')
const request = require('supertest')
const Task = require('../src/models/task')
const {
  userOne,
  userTwo,
  setupDatabase,
  taskOne
} = require('./fixtures/db')

const taskOneId = taskOne._id

beforeEach(setupDatabase)

test('Should create task for user', async () => {
  const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Test task description"
    }).expect(201)

  const task = await Task.findById(response.body._id)

  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})


test('Get all user Tasks', async () => {
  const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const totalTasks = response.body.length

  expect(totalTasks).toBe(2)
})

test('Test delete task security', async () => {
  await request(app).delete('/tasks/' + taskOneId)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  //Assert task is still in database after the deletion attempt
  const task = await Task.findById(taskOneId)
  expect(task).not.toBeNull()
})


