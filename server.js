const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded())

const api = require("./server/routes/api")
app.use("/", api)

port = 3000
app.listen(port, function (req, res) { console.log("App is listening on port:" + port) })

const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/expenses")

/*let data = require('./data.json')
data.forEach( d => {
    const expenses = new Expenses(d)
    expenses.save()
}) */
