const express = require('express')
const usersRoutes = express.Router()
const userController = require('../../controllers/userController')

usersRoutes.get('/users', userController.index)
usersRoutes.post('/user', userController.newUser)

module.exports = usersRoutes