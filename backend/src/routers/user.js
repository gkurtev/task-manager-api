const express = require('express')
const User = require('../models/user')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')
const router = new express.Router()
const authMiddleware = require('../middleware/auth')
const uploadMiddleware = require('../middleware/upload')
const sharp = require('sharp')

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()

    res.status(201).send({user, token})
  } catch (e) {
    res.status(404).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.send({user, token})
  } catch (e) {
    /* handle error */
    res.status(400).send()
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (e) {
    rest.status(500).send(e)
  }
})

router.get('/users/me', authMiddleware, async (req, res) => {
  res.send(req.user)
})

//update user endpoint
router.patch('/users/me', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValid = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValid) {
    return res.status(400).send({error: 'Invalid updates'})
  }

  try {
    const user = req.user

    updates.forEach((update) => {
      user[update] = req.body[update]
    })

    await user.save()

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', authMiddleware, async (req, res) => {
  try {
    await req.user.remove()
    sendCancelEmail(req.user.email, req.user.name)


    res.send(req.user)
  } catch (e) {
    /* handle error */
    res.status(401).send()
  }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
  try {
    const currentToken = req.token
    req.user.tokens = req.user.tokens.filter(x => x.token !== currentToken)

    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = []

    await req.user.save()

    res.send()
  } catch (e) {
    /* handle error */
    res.status(500).send()
  }
})

router.post('/users/me/avatar', authMiddleware, uploadMiddleware.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width: 150, height: 150}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()

  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error('no user or avatar')
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)

  } catch (e) {
    /* handle error */
    res.status(404).send()
  }
})


module.exports = router
