const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const router = require("./routes/routes")
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use("/",router);

app.listen(8080,() => {
    console.log("Servidor rodando")
});
