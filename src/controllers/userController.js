const { getData, insertData, createOrUpdateData, validateDB, validateUserInput, getUserId, updateData } = require('../utils/functions')
const userService = require('../services/user.service')

module.exports = {
    async index(req, res){
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const users = getData('users.json')
        return res.status(200).json({users: users})
    },

    async addNewUser(req, res) {
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})

        const checkInput = validateUserInput(req.body)
        if(checkInput.length)
            return res.status(400).json({message: checkInput})

        const { id, name, email } = req.body;
        const userData = {
            id: id,
            name: name,
            email: email
        }

        insertStatus = insertData('users.json', userData, 'id', 'email')

        if(!insertStatus) 
            return res.status(500).json({message: 'user.json database corrupted'})
        else if(Array.isArray(insertStatus)) 
            return res.status(200).json({message: insertStatus.map(dataKey => `The ${dataKey} '${userData[dataKey]}' is being used`)})
        else 
            return res.status(201).json(getData('users.json'))
    },

    async updateUser(req, res) {
        const { id } = req.params
        const updateUserData = req.body
        //get user by id, if it exists
        matchUser = getUserId('users.json', id)
        if(Object.keys(matchUser).length) {
            //check if all update keys are valid
            delete matchUser.id
            const invalidKeys = Object.keys(updateUserData).filter(key => !Object.keys(matchUser).includes(key))
            if(invalidKeys.length) {
                return res.status(400).json({message: `The object cannot contain the following keys:${ invalidKeys.map(key => `' ${key}'`) }.` })
            }
            //
            updateData('users.json', id, updateUserData)
        }
        return res.status(200).json({message: 'User not found'})
        //check if all keys inside the body are valid, else returns error


    },
}