
var mysql = require('mysql');

var connectToLocalhost = false;

//console.log("LOADED POOL DB")
if (connectToLocalhost)
    // connect to the db
    dbConnectionInfo = {
        //localhost credentials
        host: "localhost", //host:"116.72.230.84"
        port: "3306",
        user: "root",
        password: "darshanjain@123",
        database: "khimesara",
        connectionLimit: 100,
        queryTimeout: 60000 // setting timeout
    };
else dbConnectionInfo = {
    //server credentials
    host: "116.72.230.84",
    port: "3306",
    user: "kalash",
    password: "darshanjain@123",
    database: "khimesaratest",
    connectionLimit: 100,
};

//create mysql connection pool
var dbconnection = mysql.createPool(
    dbConnectionInfo
);

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
    // console.log('DB Connection established');

    connection.on('error', function (err) {
        //alert("ERROR AAYA RE")
        console.error(new Date(), 'MySQL error', err.code, "EEEEEEEEEEEEEEEEEEEEEEEEEEEee");
    });
    connection.on('close', function (err) {
        // alert("AAYA RE")
        console.error(new Date(), 'MySQL close', err, "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
    });

});

module.exports = {
    connectToLocalhost: connectToLocalhost,
    dbconnection: dbconnection
};


// var connection = mysql.createConnection({
//     host: "116.72.230.84",
//     port: "3306",
//     user: "kalash",
//     password: "darshanjain@123",
//     database: "khimesaratest"
// });
// // console.log(connection, "Individual");
// connection.connect();

// module.exports = connection;

// var mysql = require('mysql')
// var pool = mysql.createPool({
//     host: "116.72.230.84",
//     port: "3306",
//     user: "kalash",
//     password: "darshanjain@123",
//     database: "khimesaratest",
//     connectionLimit: 100
// })

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     }
//     if (connection) {
//         console.log("released called");
//         //connection.release();
//     }
//     return
// })
// module.exports = pool