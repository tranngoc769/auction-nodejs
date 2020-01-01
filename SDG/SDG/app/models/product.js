const db = require('../utils/db');
const tb_product = 'product';

module.exports = {
    addProDuct: async (ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) => {
        const sql = `INSERT INTO product(ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) VALUES product(ID, ProName, curPrice, catId, sellNowPrice, stepPrice, HighestBidderID, countBidder, pubDate, endDate, ImagePro, Describle, sellerID, isExtension) 
        VALUES (${ProName},${curPrice},${catId},${sellNowPrice},${stepPrice},${HighestBidderID},${countBidder},${pubDate},${endDate},${ImagePro},${Describle},${sellerID},${isExtension})`;////console.log(sql);
        const rows = await db.load(sql);
        console.log("SQL:", sql);
        return;
    },
    getOnebyId: async (id) => {
        const sql = `SELECT  *
                     FROM ${tb_product} 
                     WHERE id = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getSubImage: async (id) => {
        const sql = `SELECT  *
        FROM product_image
        WHERE proID = ${id}`;
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    }
};
