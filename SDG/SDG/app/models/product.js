const db = require('../utils/db');

const tb_product = 'product';
const pageSize = 1;


module.exports = {
    addProDuct: async(ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) => {
        const sql = `INSERT INTO product(ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) VALUES product(ID, ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) 
        VALUES (${ProName},${curPrice},${catId},${sellNowPrice},${stepPrice},${HighestBidderID},${countBidder},${pubDate},${endDate},${ImagePro},${Describle},${sellerID},${isExtension})`; ////console.log(sql);
        const rows = await db.load(sql);
        console.log("SQL:", sql);
        return;
    },
    getOnebyId: async(id) => {
        const sql = `SELECT  *
                     FROM ${tb_product} 
                     WHERE id = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getSubImage: async(id) => {
        const sql = `SELECT  *
        FROM product_image
        WHERE proID = ${id}`;
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getAllProducts: async() => {
        const sqlQuery = `SELECT * FROM ${tb_product}`;
        const rows = await db.load(sqlQuery);
        return rows;
    },

    //truy van DB de lay product theo page
    getProductsByCatIdPaging: async(id, page) => {
        let sql = `SELECT count(*) AS total FROM ${tb_product} WHERE catId=${id}`;
        const rs = await db.load(sql);

        const totalP = rs[0].total;
        console.log(totalP);

        const pageTotal = Math.floor(totalP / pageSize);
        if (totalP % pageSize != 0)
            pageTotal = pageTotal = 1;

        const offset = (page - 1) * pageSize;

        //truy van DB de lay product theo page
        sql = `SELECT * FROM ${tb_product} WHERE catId=${id} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await db.load(sql);
        return {
            pageTotal: pageTotal,
            products: rows
        };
    }


};