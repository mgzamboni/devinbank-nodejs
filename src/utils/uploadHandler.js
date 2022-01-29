// This was inspired on the following blogpost:
// https://consolelog.com.br/upload-de-arquivos-imagens-utilizando-multer-express-nodejs/
const multer = require('multer')
const fileSystem = require('fs')

function manageStorage(){
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'src/uploads/')
        },
        filename: function (req, file, cb) {
            // Extração da extensão do arquivo original:
            const extensaoArquivo = file.originalname.split('.')[1];

            // Cria um código randômico que será o nome do arquivo
            let novoNomeArquivo = ''
            do {
                novoNomeArquivo = require('crypto')
                .randomBytes(6)
                .toString('hex');
            } while (fileSystem.existsSync(`src/uploads/${novoNomeArquivo}.${extensaoArquivo}`))

            // Indica o novo nome do arquivo:
            cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
        }
    })
}

module.exports = {
    manageStorage
}
