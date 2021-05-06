const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const authMiddleware = require('../middleware/auth')

router.post('/tasks', authMiddleware, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task)
  } catch (e) {
    /* handle error */
    res.status(400).send(e)
  }
})

// tasks?sortBy=createdAt:desc
router.get('/tasks', authMiddleware, async (req, res) => {
  const match = {}
  const sort = {}
  const limit = parseInt(req.query.limit)
  const skip = parseInt(req.query.skip)

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit,
        skip,
        sort
      },
    }).execPopulate()

    res.send(req.user.tasks)
  } catch (e) {
    /* handle error */
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({_id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()

    }

    res.send(task)

  } catch (e) {
    /* handle error */
    res.status(500).send(e)

  }
})

// update task
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['completed', 'description']
  const isValid = updates.every(update => allowedUpdates.includes(update))

  if (!isValid) {
    return res.status(400).send({error: 'invalid properties to update'})
  }

  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => {
      task[update] = req.body[update]
    })
    await task.save()

    res.send(task)
  } catch (e) {
    /* handle error */
    res.status(500).send(e)
  }
})

// delete task by id
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id)
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    /* handle error */
    res.status(500).send()
  }
})

module.exports = router
