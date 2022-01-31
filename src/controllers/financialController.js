const { getData, createOrUpdateData, getDataXlsx, getUserId, getAvailableId, checkMissingFinanceProps, checkInvalidFinanceProps, checkFileData, insertFinancialData, removeFinancialData } = require('../utils/functions')
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

        // Check if userId is valid
        if(isNaN(userId)) {
            fileSystem.unlinkSync('src/uploads/'+filename)
            return res.status(400).json({message: 'Invalid id format'})
        }

        // Check if file format is .xlsx
        if(filename.split('.')[1] !== 'xlsx') {
            fileSystem.unlinkSync('src/uploads/'+filename)
            return res.status(400).json({message: 'Invalid file format, only .xlsx files are accepted'})
        }
        
        const matchUser =  getUserId('users.json', userId)
        // Check if existis an user with the given userId
        if(Object.keys(matchUser).length) {

            // Read file into an object array
            const financialDataArray = getDataXlsx(filename)
            fileSystem.unlinkSync('src/uploads/'+filename)

            // Check if file is empty
            if(!financialDataArray.length)
                return res.status(200).json({message: 'File is empty'})
            
            // Check if the file has missing columns
            const missingKeys = checkMissingFinanceProps(financialDataArray)
            if(missingKeys.length > 0) {
                return res.status(400).json({message: `All fields must be filled, check the following columns:${missingKeys.map(prop => ` ${prop}`)}.`})
            }

            // Check if the file has invalid columns
            const financeProps = checkInvalidFinanceProps(financialDataArray)
            if(financeProps.length > 0) {
                return res.status(400).json({message: `The following columns are invalid:${financeProps.map(prop => ` ${prop}`)}.`})
            }

            // Check if the file has invalid data
            const invalidFileData = checkFileData(financialDataArray)
            if(invalidFileData.length > 0)
                return res.status(400).json({message: `Some of the data inside the file isn't in a valid format`}) 

            insertFinancialData('financial.json', userId, financialDataArray)
            return res.status(201).json(getData('financial.json'))
        
        }
        fileSystem.unlinkSync('src/uploads/'+filename)
        return res.status(200).json({message: 'User not found, invalid id'})
    },

    async deleteFinance(req, res) {
        const {userId, financialId} = req.params
        if(isNaN(userId) || isNaN(financialId))
            return res.status(400).json({message: `'userId' and 'financialId' can only be numbers `})

        const matchUser =  getUserId('users.json', userId)
        // Check if existis an user with the given userId
        if(!Object.keys(matchUser).length) 
            return res.status(200).json({message: `'userId' not found`})

        const updatedFinancial = removeFinancialData('financial.json', userId, financialId)
        if(updatedFinancial)
            return res.status(200).json(getData('financial.json'))
        else
            return res.status(200).json({message: `The financialId wasn't found`})

    }
}