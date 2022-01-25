const fileSystem = require('fs')

function validateDB(filename){
    return fileSystem.existsSync('src/database/'+filename) 
}

function getData(filename){
    const result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'))
    return result
}

function insertData(filename, data){
    let result = JSON.parse(fileSystem.readFileSync('src/database/'+filename, 'utf8'));
    if (Array.isArray(result)){
        result.push(data)
        fileSystem.writeFileSync('src/database/'+filename, JSON.stringify(result))
        return result.length
    } else {
        return null
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