const db = require('../utils/db');
const tb_account = 'user_account';
const idField = 'id';
const tb_info = 'user_info';
const tb_role = 'roles';

module.exports = {
    resLogin: async (username, password) => {
        const sql = `SELECT  a.id, a.id_role , i.fullName ,r.byname
                     FROM ${tb_account} a INNER JOIN ${tb_info} i 
                                           ON a.id = i.accountID
                                          INNER JOIN ${tb_role} r
                                           ON a.id_role = r.id
                     WHERE username = '${username}' AND password = '${password}' AND isDeleted=0`;
        ////console.log(sql);
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
    getUserInfo: async (id) => {
        const sql = `SELECT  *
                     FROM ${tb_info} i              
                     WHERE i.accountID= ${id}`;
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
    getWantToUpdate: async (id) => {
        const sql = `SELECT  a.wantToUpdate, a.id_role
                     FROM ${tb_account} a              
                     WHERE a.id= ${id}`;
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getCustomer: async (page, perpage, query_search,field,sort) => {
        const start_index = (page - 1) * perpage;
        const sql = `SELECT  a.id, a.id_role , i.fullName, a.username, i.email,i.phone,i.DOB,a.wantToUpdate
                     FROM ${tb_account} a INNER JOIN ${tb_info} i
                                           ON a.id = i.accountID
                     WHERE a.id_role!=1 AND isDeleted=0
                            AND (i.fullName like '%${query_search}%' ||a.username like '%${query_search}%' 
                                 || i.phone like  '%${query_search}%' || i.email like  '%${query_search}%'
                                  )
                     ORDER BY ${field} ${sort}
                     LIMIT ${start_index} , ${perpage}`;
        //console.log(sql);
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
    wantUpdateRole: async (entity) => {
        const rows = await db.update(tb_account, idField, entity);
        return rows;
    },
    responseUpdateRole: async (entity) => {
        const rows = await db.update(tb_account, idField, entity);
        return rows;
    }
};
