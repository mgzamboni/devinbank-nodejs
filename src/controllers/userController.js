const { getData, insertData, createOrUpdateData, getDataArray, validateDB } = require('../utils/functions')
const userService = require('../services/user.service')

module.exports = {
    async index(req, res){
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const users = getData('users.json')
        return res.status(200).json({users: users})
    },

    async newUser(req, res){
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const userData = req.body
        if(insertData('users.json', userData) === null) {
            return res.status(500).json({message: 'invalid'})
        }
        console.log(getDataArray('users.json'))
        return res.status(200).json(getData('users.json')) 
    },
}