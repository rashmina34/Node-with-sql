'use strict';
(() => {
    const mysqlDatabseConn = require('../helpers/db.helper');

    module.exports = async (getAttributes, tableName) => {
        try {
            // const [rows] = await mysqlDatabseConn.query('INSERT INTO ?? SET ?', [tableName, insertObject])
            const [rows] = await mysqlDatabseConn.query(`SELECT ${getAttributes} FROM ${tableName} WHERE ?? SET ?`, [tableName, insertObject])
            return rows;
        } catch (error) {
            throw error;
        };
    }
})();