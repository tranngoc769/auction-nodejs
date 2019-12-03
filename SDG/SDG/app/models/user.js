const db = require('../utils/db');
const tb_account = 'user_account';

module.exports = {
    resLogin: async (username, password) => {
        const sql = `SELECT  id, id_role
                     FROM ${tb_account} 
                     WHERE username = '${username}' AND password = '${password}'`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
};
