const { getData, insertData, createOrUpdateData, validateDB, validateUserInput, getUserId, updateData } = require('../utils/functions')
const userService = require('../services/user.service')

module.exports = {
    async index(req, res){
        // #swagger.tags = ['Users']
        // #swagger.description = 'Endpoint para obter a lista de usuários'
        if (validateDB('users.json') === false) return res.status(500).json({message: 'users.json database not found'})
        const users = getData('users.json')
        return res.status(200).json({users: users})
    },

    async addNewUser(req, res) {
        /*
            #swagger.tags = ['Users']
            #swagger.description = 'Endpoint para adicionar um novo usuário a lista de usuários'
            #swagger.consumes = ['application/json']
            #swagger.parameters['obj'] = { 
                in: 'body', 
                required: 'true',
                '@schema': { 
                    "required": ["id", "name", "email"], 
                    "properties": { 
                        "id": { 
                            "required": true,
                            "type": "number",
                            "example": 5, 
                        },
                        "name": {
                            "required": true,
                            "type": "string",
                            "example": "fulano",
                        },
                        "email": {
                            "required": true,
                            "type": "string",
                            "example": "fulano@dev.com", 
                        },
                    } 
                } 
            } 
        */
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
        /*
            #swagger.tags = ['Users']
            #swagger.description = 'Endpoint para atualizar um usuário'
            #swagger.consumes = ['application/json']
            #swagger.parameters['id'] = {
                description: 'ID do usuário a ser atualizado',
                type: 'number',
                required: 'true',
            } 
            #swagger.parameters['obj'] = { 
                in: 'body', 
                required: 'true',
                '@schema': { 
                    "required": ["name", "email"], 
                    "properties": { 
                        "name": {
                            "required": true,
                            "type": "string",
                            "example": "fulano",
                        },
                        "email": {
                            "required": true,
                            "type": "string",
                            "example": "fulano@dev.com", 
                        },
                    } 
                } 
            } 
        */
        const { id } = req.params
        if(isNaN(id))
            return res.status(400).json({message: 'Invalid id format'})

        const updateUserData = req.body
        matchUser = getUserId('users.json', id)
        if(Object.keys(matchUser).length) {
            delete matchUser.id
            const invalidKeys = Object.keys(updateUserData).filter(key => !Object.keys(matchUser).includes(key))

            if(invalidKeys.length) {
                return res.status(400).json({message: `The object cannot contain the following keys:${ invalidKeys.map(key => `' ${key}'`) }.` })
            }
            
            const verifyNoChange = Object.keys(matchUser).filter(key => {return matchUser[key] !== updateUserData[key] })
            if(!verifyNoChange.length)
                return res.status(200).json({message: "There's no content to be updated"})

            const updateStatus = updateData('users.json', id, updateUserData)

            if(!updateStatus) 
                return res.status(500).json({message: 'user.json database corrupted'})
            else if(Array.isArray(updateStatus)) 
                return res.status(200).json({message: updateStatus.map(dataKey => `The ${dataKey} '${updateUserData[dataKey]}' is being used`)})
            else 
             return res.status(201).json(getData('users.json'))
        }
        return res.status(400).json({message: 'User not found, invalid id'})
    },

    async userInfo(req, res) {
        /*
            #swagger.tags = ['Users']
            #swagger.description = 'Endpoint para pegar os dados de um usuário'
            #swagger.consumes = ['application/json']
            #swagger.parameters['id'] = {
                description: 'ID do usuário que será buscado',
                type: 'number',
                required: 'true',
            } 
        */
        const { id } = req.params
        if(isNaN(id))
            return res.status(400).json({message: 'Invalid id format'})

        matchUser =  getUserId('users.json', id)
        if(Object.keys(matchUser).length) {
            return res.status(200).json(matchUser)
        }
        return res.status(200).json({message: 'User not found, invalid id'})
    }
}