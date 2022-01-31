const express = require('express')
const app = express()
const routes = require('./routes')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(routes);

app.listen(3000, () => console.log('Executando'))