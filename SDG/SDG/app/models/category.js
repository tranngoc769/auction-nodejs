const db = require('../utils/db');
const tb_category = 'category';
const idField = 'ID';

module.exports = {
    getParentCategory: async () => {
  const sql = "SELECT * FROM `category` WHERE `parentID` IS NULL ";
  const rows = await db.load(sql);
  return rows;
  },
  getCatNamebyID: async (id) => {
  const sql = `SELECT Catname FROM category WHERE ID='${id}'`;
  const rows = await db.load(sql);
  return rows;
  },
  getChildCategory: async id => {
    const sql = `SELECT * FROM category WHERE parentID = ${id} `;
    const rows = await db.load(sql);
    return rows;
  },
  
  getCatIDbyname: async Catname => {
    const sql = `SELECT ID FROM category WHERE Catname = '${Catname}'`;
    const row = await db.load(sql);
    return row;
  },
  getOnebyId: async id => {
    const sql = `SELECT  *
                     FROM category
                     WHERE id = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getAllCategory: async(page, perpage, query_search, field, sort) => {
        const start_index = (page - 1) * perpage;
        const sql = `SELECT  c1.ID, c1.Catname , c2.catName as parentCate, c2.ID as parentID
                     FROM ${tb_category} c1 INNER JOIN ${tb_category} c2
                                           ON c1.ParentID = c2.ID
                     WHERE  (c1.Catname like '%${query_search}%' ||c2.Catname like '%${query_search}%' )
                     ORDER BY ${field} ${sort}
                     LIMIT ${start_index} , ${perpage}`;
        console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    delByID: async id => {
        const nr = await db.del(tb_category, idField, id);
        console.log(nr);
        return nr;
    },
    getParentCate: async() => {
        const sql = `SELECT *
                     FROM ${tb_category} a              
                     WHERE a.parentID is NULL`;
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    UpdateCate: async(entity) => {
        const rows = await db.update(tb_category, idField, entity);
        return rows;
    },
    getCatIDbyname: async(Catname) => {
        const sql = `SELECT ID FROM category WHERE Catname = '${Catname}'`;
        const row = await db.load(sql);
        return row;
    },
    getCatbyID: async(catId) => {
        const sql = `SELECT * FROM category WHERE ID = '${catId}'`;
        const row = await db.load(sql);
        console.log(row);
        return row;
    },
    AddOneCate: async(entity) => {
        const rows = await db.add(tb_category, entity);
        return rows;
    }
};