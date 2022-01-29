const express = require('express')
const usersRoutes = express.Router()
const userController = require('../../controllers/userController')

usersRoutes.get('/v1/users', userController.index)
usersRoutes.post('/v1/user', userController.addNewUser)
usersRoutes.patch('/v1/user/:id', userController.updateUser)
usersRoutes.get('/v1/user/:id', userController.userInfo)


module.exports = usersRoutes