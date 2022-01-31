const { getData, createOrUpdateData, getDataXlsx, getUserId, getAvailableId, checkMissingFinanceProps, checkInvalidFinanceProps, 
    checkFileData, insertFinancialData, removeFinancialData, getFinancialUserId } = require('../utils/functions')
const financialService = require('../services/financial.service')
const fileSystem = require('fs')

module.exports = {
    async index(req, res){
        // #swagger.tags = ['Financial']
        // #swagger.description = 'Endpoint para obter a lista de relatórios financeiros'
        const financial = getData('financial.json')
        return res.status(200).json({financial: financial})
    },

    async addNewFinance(req, res) {
        /*
            #swagger.tags = ['Financial']
            #swagger.description = 'Endpoint para ler dados de um arquivo xlsx e armazenar na base de dados'
            #swagger.consumes = ['multipart/form-data']  
            #swagger.parameters['userId'] = { 
                description: 'ID do usuário.',
                type: 'number',
                required: 'true'
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                type: 'file',
                required: 'true',
                description: 'Some description...',
                accept: '/',
            } 
        */
        const { filename } = req.file
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
        /*
            #swagger.tags = ['Financial']
            #swagger.description = 'Endpoint para remover uma transação de um usuário específico'
            #swagger.parameters['userId'] = { 
                description: 'ID do usuário.',
                type: 'number',
                required: 'true',
            }
            #swagger.parameters['financialId'] = {
                description: 'ID de uma transação',
                type: 'number',
                required: 'true',
            } 
        */
        const {userId, financialId} = req.params
        if(isNaN(userId) || isNaN(financialId))
            return res.status(400).json({message: `The 'userId' and 'financialId' can only be numbers `})

        const matchUser =  getUserId('users.json', userId)
        // Check if existis an user with the given userId
        if(!Object.keys(matchUser).length) 
            return res.status(200).json({message: `'userId' not found`})

        const updatedFinancial = removeFinancialData('financial.json', userId, financialId)
        if(updatedFinancial)
            return res.status(200).json(getData('financial.json'))
        else
            return res.status(200).json({message: `The financialId wasn't found`})

    },

    async getExpenses(req, res) {
            /*
            #swagger.tags = ['Financial']
            #swagger.description = 'Endpoint que retorna a soma total dos valores de transações de um usuário ou a soma dos valores filtrados pela query 'typeOfExpenses''
            #swagger.parameters['userId'] = { 
                description: 'ID do usuário.',
                type: 'number',
                required: 'true',
            }
            #swagger.parameters['typeOfExpenses'] = {
                in: 'query',
                description: 'Filtro que identifica os tipos de transações que serão calculados',
                type: 'array',
                collectionFormat: 'multi',
            } 
        */
        const { userId } = req.params
        const query = req.query
        if(isNaN(userId) )
            return res.status(400).json({message: `The 'userId' can only be numbers `})

        const matchUser = getUserId('users.json', userId)
        if(!Object.keys(matchUser).length) 
            return res.status(200).json({message: `'userId' not found`})

        if(!Object.keys(getFinancialUserId('financial.json', userId)).length)
            return res.status(200).json({message: `'userId' not registered in financial database`})

        const userFinancesInfo = getFinancialUserId('financial.json', userId)
        if(Object.keys(query).length) {
            const allvalues = query.typeOfExpenses.map(data => userFinancesInfo.financialData.map(finance => {
                return finance['typeOfExpenses'] === data ? finance['price'] : 0
            }))
            const totalValue = allvalues.flat().reduce((a,b) => a+b).toFixed(2)
            return res.status(200).json({message: `The total value registered given the expenses${query.typeOfExpenses.map(elem => ` '${elem}'`)} is: ${totalValue}`})
        } else {
            const allvalues = userFinancesInfo.financialData.map(finance => { return finance['price'] })
            const totalValue = allvalues.flat().reduce((a,b) => a+b).toFixed(2)
            return res.status(200).json({message: `The total value registered is: ${totalValue}`})
        }
    }
}