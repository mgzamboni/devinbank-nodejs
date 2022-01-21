const express = require('express')
const financialRoutes = express.Router()
const financialController = require('../../controllers/financialController')

financialRoutes.get('/v1/financial', financialController.index)

module.exports = financialRoutes