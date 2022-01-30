const fileSystem = require('fs')
var xlsx = require('xlsx');

function validateDB(filename){
    return fileSystem.existsSync('src/database/'+filename) 
}

function checkInvalidKeys(reqBody) {
    const invalidKeys = Object.keys(reqBody).filter(key => { 
        if(key === 'id' && typeof reqBody[key] !== 'number' )
            return true
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
    const dataArray = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'))
    return dataArray
}

function getDataXlsx(filename){
    const workbook = xlsx.readFile('src/uploads/'+filename);
    const sheet_name_list = workbook.SheetNames;
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {raw: false})
}

function insertData(filename, newObj, ...keys){
    const dataArray = getDataArray(filename)
    if (dataArray){
        DuplicateObj = checkDuplicateObj(dataArray, newObj, keys)
        if(!DuplicateObj) {
            dataArray.push(newObj)
            fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(dataArray))
            return dataArray.length
        } else {
            return getDuplicateKey(DuplicateObj, newObj, keys)
        }
    } else return null
}

function updateData(filename, objId, newData){
    const dataArray = getDataArray(filename)
    if (dataArray) {
        userObj = getUserId(filename, objId)
        filteredDataArray = dataArray.filter(user => { return user['id'] !== parseInt(objId) })
        DuplicateObj = checkDuplicateObj(filteredDataArray, newData, ['email'])
        if(!DuplicateObj) {
            const updatedDataArray = dataArray.map(user => { return (user['id'] === parseInt(objId)) ? {...user, ...newData} : {...user}  })
            fileSystem.writeFileSync('src/database/' + filename, JSON.stringify(updatedDataArray))
            return dataArray.length
        } else {
            return getDuplicateKey(DuplicateObj, newData, ['email'])
        }
    } else return null
}


function checkDuplicateObj(objArray, newObj, keys) {
    // if(!Array.isArray(keys))
    return objArray.find(obj => keys.find(key => { if (obj[key] === newObj[key]) return key}) )
}

function getDuplicateKey(obj, newObj, keys) {
    if(obj !== undefined) {
        return keys.filter(key => obj[key] === newObj[key])
    }
}

function getDataArray(filename) {
    const dataArray = JSON.parse(fileSystem.readFileSync('src/database/' + filename, "utf8"))
    return Array.isArray(dataArray) ? dataArray : null
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

function getAvailableId(filename, idKey) {
    usersData = getDataArray(filename)
    if(usersData) {
        let newId = 0
        do {
            newId++
        } while(usersData.find(user => { return user[idKey] === parseInt(newId) }) !== undefined)
        return newId;
    }
    return 0
}

function validateFileHeader(financesDataArray) {
    const validKeys = ['price', 'typeOfExpenses', 'date', 'name']

    const checkKeys = validKeys.filter(key => {return !financesDataArray[0].hasOwnProperty(key)})
    if(checkKeys.length > 0)
        //return checkKeys
    if(Object.getOwnPropertyNames(financesDataArray[0]).length > 4)
        return Object.keys(financesDataArray[0]).filter(key => !validKeys.includes(key))
    return null
}

function validateFileContent(financesDataArray) {

}

module.exports = {
    validateDB,
    validateUserInput,
    getData,
    insertData,
    createOrUpdateData,
    getDataArray,
    getUserId,
    updateData,
    getDataXlsx,
    getAvailableId,
    validateFileHeader
}