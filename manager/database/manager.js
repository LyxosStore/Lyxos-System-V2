const MySQL = require('mysql');

sql = MySQL.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8mb4'
});

sql.getConnection(function(err, connection) {
    if (err) {
        throw err;
    }

    console.log('[SQL] | Connected to the MySQL server!');
});