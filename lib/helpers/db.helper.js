'use-strict';
const mysql = require('mysql2/promise');
(connection => {
    let dbClient = null;
    let tranConn = null;
    connection.init = async () => {
        try {
            if (!dbClient)
                dbClient = await mysql.createPool({
                    user: process.env.MYSQL_DB_USER,
                    password: process.env.MYSQL_DB_PASSWORD,
                    host: process.env.MYSQL_DB_HOST,
                    // port: process.env.MYSQL_DB_PORT,
                    database: process.env.MYSQL_DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10000,
                    queueLimit: 0
                });
            return dbClient;
        } catch (err) {
            //   log.error({}, err, 'mysql.database.helper.js', 'connection.init');
            throw err;
        }
    };

    connection.getConnection = async () => {
        try {
            if (!tranConn) tranConn = await dbClient.getConnection();
            return tranConn;
        } catch (error) {
            //   log.error({}, error, 'mysql.database.helper.js', 'connection.execute');
            throw error;
        }
    };

    connection.execute = (query, fields) => {
        try {
            return (tranConn || dbClient).execute(query, fields);
        } catch (error) {
            //   log.error({}, error, 'mysql.database.helper.js', 'connection.execute');
            throw error;
        }
    };

    connection.query = (query, fields) => {
        try {
            return (tranConn || dbClient).query(query, fields);
        } catch (error) {
            //   log.error({}, error, 'mysql.database.helper.js', 'connection.query');
            throw error;
        }
    };


    connection.end = () => {
        try {
            return dbClient.end();
        } catch (error) {
            //   log.error({}, error, 'mysql.database.helper.js', 'connection.end');
            throw error;
        }
    };


})(module.exports);
