const express = require('express')
const usersRoutes = express.Router()
const userController = require('../../controllers/userController')

usersRoutes.get('/users', userController.index)
usersRoutes.post('/user', userController.addNewUser)
usersRoutes.patch('/user/:id', userController.updateUser)

module.exports = usersRoutes