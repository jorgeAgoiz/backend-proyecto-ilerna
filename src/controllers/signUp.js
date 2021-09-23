const { connection } = require("../services/mysql");

exports.signUp = (req, res, next) => {
    connection.query("select * from user", (err, results, fields) => {
        console.log(err)
        console.log(results)
    })
    return res.send("<h1>Hey There!!</h1>")
}