const swaggerAutogen = require('swagger-autogen')()
const outputFile = 'src/swagger_output.json'
const endpointsFiles = ['./src/server.js']

const doc = {
    info: {
        title: 'DevInBank API',
        description: 'Manage users and their financial datas with this API',
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Users",
            "description": "Endpoints"
        },
        {
            "name": "Financial",
            "description": "Endpoints"
        }
    ],
}

swaggerAutogen(outputFile, endpointsFiles, doc)