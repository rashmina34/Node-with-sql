'use strict';
(() => {
    // const { mysqlHelper } = require('common/helpers');
    const mysqlDatabseConn = require('../helpers/db.helper');

    module.exports = async (insertObject, tableName) => {
        try {
            const [rows] = await mysqlDatabseConn.query('INSERT INTO ?? SET ?', [tableName, insertObject])
            return rows;
        } catch (error) {
            throw error;
        };
    }
})();