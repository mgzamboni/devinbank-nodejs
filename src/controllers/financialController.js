const { getData, createOrUpdateData, getDataXlsx } = require('../utils/functions')
const financialService = require('../services/financial.service')


module.exports = {
    async index(req, res){
        const financial = getData('financial.json')
        return res.status(200).json({financial: financial})
    },

    async addNewFinance(req, res) {
        const { filename, size } = req.file

        const obj = getDataXlsx(filename)
        return res.status(200).json({filedata: {filename, size}, financial: obj})
    }
}