const db = require('../utils/db');

module.exports = {
    getParentCategory: async() => {
        const sql = 'SELECT * FROM `category` WHERE `parentID` IS NULL ';
        const rows = await db.load(sql);
        return rows;
    },
    getChildCategory: async(id) => {
        const sql = `SELECT * FROM category WHERE parentID = ${id} `;
        const rows = await db.load(sql);
        return rows;
    },
    getCatIDbyname: async(Catname) => {
        const sql = `SELECT ID FROM category WHERE Catname = '${Catname}'`;
        const row = await db.load(sql);
        return row;
    }

};