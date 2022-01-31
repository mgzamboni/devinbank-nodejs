const express = require('express')
const multer = require('multer')
const financialRoutes = express.Router()
const financialController = require('../../controllers/financialController')
const { manageStorage } = require('../../utils/uploadHandler')

const storage = manageStorage()

const upload = multer({storage})

financialRoutes.get('/v1/finance', financialController.index)
financialRoutes.post('/v1/finance/:userId', upload.single('file'),financialController.addNewFinance)
financialRoutes.delete('/v1/finance/:userId/:financialId', financialController.deleteFinance)


module.exports = financialRoutes