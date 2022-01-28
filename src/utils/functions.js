const fileSystem = require('fs')

function validateDB(filename){
    return fileSystem.existsSync('src/database/'+filename) 
}

function checkInvalidKeys(reqBody) {
    const invalidKeys = Object.keys(reqBody).filter(key => { 
        if(key === 'id' && typeof reqBody[key] !== 'number' )
            return true
        // else if((key === 'name' || key === 'email') && typeof reqBody[key] !== 'string') 
        else if((key === 'name' || key === 'email')) {
            if (typeof reqBody[key] !== 'string' || !isNaN(reqBody[key])) return true
            if(!reqBody[key].length) return true
        }
        else
            return false
        }
    )
    return invalidKeys;
}

function validateUserInput(reqBody) {
    invalidKeys = checkInvalidKeys(reqBody);
    return invalidKeys.map(key => {
        if(key === 'id')
            return `The '${key}' prop is a '${typeof reqBody[key]}' but it should be a 'number'`
        else {
            if(typeof reqBody[key] !== 'string') 
                return `The '${key}' is a '${typeof reqBody[key]}' but it should be a 'string'`
            if(!reqBody[key].length) 
                return `The '${key}' cannot be empty`
            if(!isNaN(reqBody[key]))
                return `The '${key}' cannot be a number`
        }
    })
}

function getData(filename){
    const result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'))
    return result
}

function insertData(filename, newObj, ...keys){
    const result = getDataArray(filename)
    if (result){
        DuplicateObj = checkDuplicateObj(result, newObj, keys)
        if(!DuplicateObj) {
            result.push(newObj)
            fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(result))
            return result.length
        } else {
            return getDuplicateKey(DuplicateObj, newObj, keys)
        }
    } else return null
}

function checkDuplicateObj(objArray, newObj, keys) {
    return objArray.find(obj => keys.find(key => { if (obj[key] === newObj[key]) return key}) )
}

function getDuplicateKey(obj, newObj, keys) {
    if(obj !== undefined) {
        return keys.filter(key => obj[key] === newObj[key])
    }
}

function getDataArray(filename) {
    const result = JSON.parse(fileSystem.readFileSync('src/database/' + filename, "utf8"))
    return Array.isArray(result) ? result : null
}

function createOrUpdateData(filename, data){
    fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(data))
}

function getUserId(filename, id) {
    usersData = getDataArray(filename)
    if(usersData) {
        return usersData.find(user => { return user['id'] === parseInt(id) }) || {}
    }
    return {}
}


module.exports = {
    validateDB,
    validateUserInput,
    getData,
    insertData,
    createOrUpdateData,
    getDataArray,
    getUserId
}