const { getData, createOrUpdateData, getDataXlsx, getUserId, getAvailableId, validateFinanceProps } = require('../utils/functions')
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
            const financialDataArray = getDataXlsx(filename)
            if(!financialDataArray.length) {
                fileSystem.unlinkSync('src/uploads/'+filename)
                return res.status(200).json({message: 'File is empty'})
            }
            fileSystem.unlinkSync('src/uploads/'+filename)
            financeProps = validateFinanceProps(financialDataArray)
            if(financeProps.length > 0) {
                return res.status(400).json({message: `The following column headers are invalid: ${financeProps.map(prop => prop)}`})
            }
            return res.status(200).json({filedata: {filename, size}, user: {...matchUser}, financial: financialDataArray})
        
        }
        fileSystem.unlinkSync('src/uploads/'+filename)
        return res.status(200).json({message: 'User not found, invalid id'})
    }
}