const fileSystem = require('fs')
const xlsx = require('xlsx');
const _ = require('lodash/array');

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
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
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

function getFinancialUserId(filename, id) {
    usersData = getDataArray(filename)
    if(usersData) {
        return usersData.find(user => { return user['userId'] === parseInt(id) }) || {}
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

function getFinancialAvailableId(financialDataArray, userId, idKey) {
    financeData = financialDataArray.find(user => { return user['userId'] === userId })
    if(financeData) {
        let newId = 0
        do {
            newId++
        } while(financeData.financialData.find(data => { return data[idKey] === parseInt(newId) }) !== undefined)
        return newId;
    }
    return 0
}

function checkMissingFinanceProps(financeDataArray) {
    const validKeys = ['price', 'typeOfExpenses', 'date', 'name']
    const missingValidKeys = financeDataArray.map(obj => validKeys.filter(key => {return !(key in obj)}))
    return _.union(...missingValidKeys)
}

function checkInvalidFinanceProps(financesDataArray) {
    const validKeys = ['price', 'typeOfExpenses', 'date', 'name']
    const filteredInvalidKeys = financesDataArray.map(obj => Object.keys(obj).filter(elem => !validKeys.includes(elem)))    
    return _.union(...filteredInvalidKeys)
}

function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569)*86400*1000));
  }

function checkFileData(financesDataArray) {
    const invalidData = financesDataArray.filter(obj => {
        // Check if 'price' is a number
        if(isNaN(obj['price']) || isNaN(obj['date']))
            return true

        // Check if 'typeOfExpenses' and 'name' are a string
        if(!isNaN(obj['typeOfExpenses']) || !isNaN(obj['name']))
            return true
        
        // Check if 'typeOfExpenses' and 'name' have invalid chars
        let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        if(regex.test(obj['typeOfExpenses']) || regex.test(obj['name']))
            return true
        
        const date = ExcelDateToJSDate(obj['date'])
        if(!(date instanceof Date && !isNaN(date.valueOf())))
             return true
        return false
    })
    return invalidData;
}

function insertFinancialData(filename, userId, newData) {
    let financialData = getDataArray(filename)

    // If user doesn't exists, insert a new entry in financial.json
    if(!Object.keys(getFinancialUserId(filename, userId)).length) {
        financialData.push({id: getAvailableId(filename, 'id'), userId: parseInt(userId), financialData: []})
    }
    // if user finances already exists, insert new data
    newData.map(data => {
        const availableId = getFinancialAvailableId(financialData, parseInt(userId), 'id')
        financialData.map(obj => {
            if(obj['userId'] === parseInt(userId)) {
                const newFinancialData = {id: availableId, ...data ,date: ExcelDateToJSDate(data.date).toLocaleDateString()}
                obj.financialData.push(newFinancialData)
            } 
        })
    })
    fileSystem.writeFileSync('src/database/' + filename, JSON.stringify(financialData))
    return financialData
}

function removeFinancialData(filename, userId, financialId) {
    var financialData = getDataArray(filename)
    const verify = financialData.map(obj => {
        if(obj['userId'] === parseInt(userId)) {
            const test = obj.financialData.findIndex(data => data.id === parseInt(financialId));
            if(test !== -1) {
                obj.financialData.splice(test, 1)
                return true
            }
        } return false
    })
    if(verify.includes(true))
        fileSystem.writeFileSync('src/database/' + filename, JSON.stringify(financialData))
    return verify.includes(true)
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
    checkMissingFinanceProps,
    checkInvalidFinanceProps,
    checkFileData,
    insertFinancialData,
    removeFinancialData,
    getFinancialUserId
}