const { getData, insertData, createOrUpdateData, getDataArray, validateDB } = require('../utils/functions')
const userService = require('../services/user.service')

module.exports = {
    async index(req, res){
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const users = getData('users.json')
        return res.status(200).json({users: users})
    },

    async addNewUser(req, res){
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const userData = req.body
        insertStatus = insertData('users.json', userData, 'id', 'email')
        console.log(insertStatus)
        if(!insertStatus) {
            return res.status(500).json({message: 'user.json database corrupted'})
        }
        else if(Array.isArray(insertStatus)) {
            return res.status(400).json({message: insertStatus.map(dataKey => `The ${dataKey} '${userData[dataKey]}' is being used`)})
        }
        else    {
            return res.status(200).json(getData('users.json'))
        }
    },
}