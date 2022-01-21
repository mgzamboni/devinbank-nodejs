const { getData, createOrUpdateData } = require('../utils/functions')
const financialService = require('../services/financial.service')

module.exports = {
    async index(req, res){
        const financial = getData('financial.json')
        return res.status(200).json({financial: financial})
    }
}