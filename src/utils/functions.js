const fileSystem = require('fs')

function validateDB(filename){
    return fileSystem.existsSync('src/database/'+filename) 
}

function validateInput(reqBody) {
    const invalidKeyValues = Object.keys(reqBody).filter(key => { 
        if(key === 'id' && typeof reqBody[key] !== 'number' )
            return true
        else if((key === 'name' || key === 'email') && typeof reqBody[key] !== 'string') 
            return true
        else
            return false
        }
    )
    return invalidKeyValues.map(key => {
        if(key === 'id')
            return `The ${key} prop is a '${typeof reqBody[key]}' but it should be a 'number'`
        else
            return `The ${key} prop is a '${typeof reqBody[key]}' but it should be a 'string'`
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
        console.log(keys.map(key => obj[key] === newObj[key]))
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

module.exports = {
    validateDB,
    validateInput,
    getData,
    insertData,
    createOrUpdateData,
    getDataArray
}