const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "admin",
    host: "localhost",
    port: 5433,
    database: "Eco"
})

module.exports = pool

 