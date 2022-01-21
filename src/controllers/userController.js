const { getData, createOrUpdateData } = require('../utils/functions')
const userService = require('../services/user.service')

module.exports = {
    async index(req, res){
        const users = getData('users.json')
        return res.status(200).json({users: users})
    }
}