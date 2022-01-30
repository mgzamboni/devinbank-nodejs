const { getData, createOrUpdateData, getDataXlsx, getUserId, getAvailableId, validateFileHeader } = require('../utils/functions')
const financialService = require('../services/financial.service')
const fileSystem = require('fs')

module.exports = {
    async index(req, res){
        const financial = getData('financial.json')
        return res.status(200).json({financial: financial})
    },

    async addNewFinance(req, res) {
        const { filename, size } = req.file
        const { userId } = req.params

        if(isNaN(userId)) {
            fileSystem.unlinkSync('src/uploads/'+filename)
            return res.status(400).json({message: 'Invalid id format'})
        }

        if(filename.split('.')[1] !== 'xlsx') {
            fileSystem.unlinkSync('src/uploads/'+filename)
            return res.status(400).json({message: 'Invalid file format, only .xlsx files are accepted'})
        }
        
        matchUser =  getUserId('users.json', userId)
        if(Object.keys(matchUser).length) {
            const obj = getDataXlsx(filename)
            console.log(getAvailableId('financial.json', 'id'))
            fileSystem.unlinkSync('src/uploads/'+filename)
            console.log(validateFileHeader(obj))
            return res.status(200).json({filedata: {filename, size}, user: {...matchUser}, financial: obj})
        
        }
        fileSystem.unlinkSync('src/uploads/'+filename)
        return res.status(200).json({message: 'User not found, invalid id'})
    }
}