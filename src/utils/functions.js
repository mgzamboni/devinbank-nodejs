const fileSystem = require('fs')

function validateDB(filename){
    return fileSystem.existsSync('src/database/'+filename) 
}

function getData(filename){
    const result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'))
    return result
}

function insertData(filename, data, ...keys){
    let result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'));
    if (Array.isArray(result)){
        DuplicateObj = checkDuplicateObj(result, data, keys)
        if(!DuplicateObj) {
            result.push(data)
            fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(result))
            return result.length
        } else {
            return getDuplicateKey(DuplicateObj, data, keys)
        }
    } else {
        return null
    }
}

function checkDuplicateObj(objArray, data, keys) {
    return objArray.find(obj => keys.find(key => { if (obj[key] === data[key]) return key}) )
}

function getDuplicateKey(obj, data, keys) {
    if(obj !== undefined) {
        return keys.filter(key => { return obj[key] === data[key]})
    }
}

function getDataArray(filename) {
    let result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, "utf8"));
    return Array.isArray(result) ? result : result = null;
  }

function createOrUpdateData(filename, data){
    fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(data))
}

module.exports = {
    validateDB,
    getData,
    insertData,
    createOrUpdateData,
    getDataArray
}