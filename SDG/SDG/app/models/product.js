
const db = require('../utils/db');
const tb_product = 'product';
const tb_category = 'category';
const tb_info = 'user_info';
const tb_account = 'user_account';
const idField = 'ID';

module.exports = {
    getAllProduct: async (page, perpage, query_search, field, sort) => {
        const start_index = (page - 1) * perpage;
        const sql = `SELECT  p.ID,p.ProName,p.sellNowPrice,p.pubDate,p.endDate,p.ImagePro,p.Describle,p.reservePrice,c.Catname,a.username
                     FROM ${tb_product} p INNER JOIN ${tb_category}  c
                                           ON p.catId=c.ID
                                            INNER JOIN ${tb_account} a
                                            ON p.sellerID=a.id
                     WHERE  (p.ProName like '%${query_search}%' ||p.Describle like '%${query_search}%' )
                     ORDER BY ${field} ${sort}
                     LIMIT ${start_index} , ${perpage}`;
        console.log(sql);
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
    delByID: async id => {
        const nr = await db.del(tb_product, idField, id);
        console.log(nr);
        return nr;
    },
    getProductOfCate: async id => {
        const sql = `SELECT  *
                     FROM ${tb_product} 
                     WHERE catId = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        //console.log("token:", rows);
        return rows;
    },
    addProDuct: async (
        ProName,
        curPrice,
        catId,
        sellNowPrice,
        stepPrice,
        countBidder,
        pubDate,
        endDate,
        Describle,
        sellerID,
        isExtension,
        ImagePro
    ) => {
        const sql = `INSERT INTO product(ProName, curPrice, catId, sellNowPrice, stepPrice, countBidder, pubDate, endDate, Describle, sellerID, isExtension,ImagePro)
        VALUES (${ProName},${curPrice},${catId},${sellNowPrice},${stepPrice},${countBidder},${pubDate},${endDate},${Describle},${sellerID},${isExtension},${ImagePro})`; ////console.log(sql);
        const rows = await db.load(sql);
        return;
    },
    getOnebyId: async id => {
        const sql = `SELECT  *
                     FROM ${tb_product} 
                     WHERE id = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getSubImage: async id => {
        const sql = `SELECT  *
        FROM product_image
        WHERE proID = ${id}`;
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getProIDbyImg: async Img => {
        const sql = `SELECT ID FROM product WHERE ImagePro = '${Img}'`;
        const row = await db.load(sql);
        return row;
    },
    addProSubImg: async (id, img) => {
        const sql = `INSERT INTO product_image(proID,image)
    VALUES (${id},${img})`;
        const row = await db.load(sql);
        return row;
    }
};
