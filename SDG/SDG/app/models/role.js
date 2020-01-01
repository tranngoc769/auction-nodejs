const db = require('../utils/db');
const tb_account = 'roles';

module.exports = {
    getOnebyId: async (id) => {
        const sql = `SELECT  *
                     FROM ${tb_account} 
                     WHERE id = ${id}`;
        ////console.log(sql);
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
};
