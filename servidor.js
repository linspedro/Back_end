const app = require('./src/app')
require("dotenv").config();

app.listen(3000, () => {
    console.log('servidor rodando em http://localhost:3000')
})