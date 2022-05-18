const moment = require("moment")
const express = require("express")
const Expenses = require("../model/Expense")
const api = express.Router()

api.get("/sanity", function (req, res) { res.send("Server and API is running") })

api.get("/expenses", function (req, res) {
    const dateRange = getDateRange(req)
    Expenses.find({
        $and: [
            { date: { $gt: dateRange.startDate } },
            { date: { $lt: dateRange.endDate } }
        ]
    })
        .sort({ date: -1 })
        .exec(function (err, expenses) {
            res.send(expenses)
        })
})

function getDateRange(req) {
    const d1 = req.query.d1 || "NoStartDate"
    const d2 = req.query.d2 || "NoEndDate"
    let startDate = 0
    let endDate = 0
    if (moment(d1).isValid() && moment(d2).isValid()) {
        startDate = moment(d1).format('LLLL')
        endDate = moment(d2).format('LLLL')
    } else if (moment(d1).isValid()) {
        startDate = moment(d1).format('LLLL')
        endDate = moment().format('LLLL')
    } else {
        startDate = moment(0).format('LLLL')
        endDate = moment().format('LLLL')
    }
    return { "startDate": startDate, "endDate": endDate }
}

api.get("/expenses/:group", function (req, res) {
    const requiredGroup = req.params.group
    Expenses.find({ group: requiredGroup })
        .exec(function (err, expenses) {
            res.send(expenses)
        })
})

api.post("/expenses", function (req, res) {
    const expenseData = req.body
    let expense = new Expenses
    expense.item = expenseData.item
    expense.amount = expenseData.amount
    expense.group = expenseData.group
    expense.date = solveDate(expenseData.date)
    expense.save()
        .then(function (doc) {
            res.send(expense)
        })
})

function solveDate(givenDate) {
    if (moment(givenDate).isValid()) {
        return moment(givenDate).format('LLLL')
    } else {
        return moment().format('LLLL')
    }
}

api.put("/update/", function (req, res) {
    const group1 = req.query.group1
    const group2 = req.query.group2
    Expenses.findOne({ group: group1 }, function (err, expense) {
        console.log(expense);
        expense.group = group2
        expense.save()
            .then(function (data) {
                res.send(data.item)
            })
    })
})

module.exports = api