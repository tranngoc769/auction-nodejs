const db = require('../utils/db');

const tb_product = 'product';
const pageSize = 1;
const tb_category = 'category';
const tb_info = 'user_info';
const tb_account = 'user_account';
const idField = 'ID';


module.exports = {
    getAllProduct: async(page, perpage, query_search, field, sort) => {
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
    addProDuct: async(ProName, curPrice, catId, sellNowPrice, stepPrice, countBidder, pubDate, endDate, Describle, sellerID, isExtension, ImagePro, startPrice) => {
        const sql = `INSERT INTO product(ProName,curPrice,catId,sellNowPrice,stepPrice,countBidder,pubDate,endDate,Describle,sellerID,isExtension,ImagePro,startPrice) VALUES (${ProName},${curPrice},${catId},${sellNowPrice},${stepPrice},${countBidder},${pubDate},${endDate},${Describle},${sellerID},${isExtension},${ImagePro},${startPrice})`;
        console.log(sql);
        const rows = await db.load(sql);
        return;
    },
    getOnebyId: async id => {
        const sql = `SELECT  *  FROM ${tb_product} WHERE id = ${id}`;
        console.log(sql);
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
    },
    getProIDbyImg: async Img => {
        const sql = `SELECT ID FROM product WHERE ImagePro = '${Img}'`;
        const row = await db.load(sql);
        return row;
    },
    addProSubImg: async(id, img) => {
        const sql = `INSERT INTO product_image(proID,image)
    VALUES (${id},${img})`;
        const row = await db.load(sql);
        return row;
    },
    getProTopBestBegCount: async() => {
        const sqlQuery = `SELECT * FROM ${tb_product} ORDER BY countBidder DESC LIMIT 0,5`;
        const rows = await db.load(sqlQuery);
        return rows;
    },
    getRemainProduct: async(endDate) => {
        const sql = `SELECT product.ID, ProName, curPrice, product.HighestBidderID,user_info.fullName, countBidder, pubDate, endDate, ImagePro, isExtension FROM product INNER JOIN user_info ON product.HighestBidderID = user_info.accountID WHERE endDate >= '${endDate}'`;
        const rows = await db.load(sql);
        return rows;
    },
    getProTopHightestPrice: async(endDate) => {

        const sqlQuery = `SELECT * FROM ${tb_product} WHERE endDate >= '${endDate}' ORDER BY curPrice DESC LIMIT 5`;
        const rows = await db.load(sqlQuery);
        return rows;
    },
    getProTopEndDate: async(endDate) => {

        const sql = `SELECT * FROM ${tb_product} WHERE endDate >= '${endDate}' ORDER BY endDate DESC LIMIT 5`;
        const rows = await db.load(sql);
        return rows;
    },
    getRemainProduct: async(endDate) => {
        const sql = `SELECT product.ID, ProName, curPrice, product.HighestBidderID,user_info.fullName, countBidder, pubDate, endDate, ImagePro, isExtension FROM product INNER JOIN user_info ON product.HighestBidderID = user_info.accountID WHERE endDate >= '${endDate}'`;

        console.log(sql);
        const rows = await db.load(sql);
        console.log(rows);
        return rows;
    },
    updateProduct: async(ID, Describle) => {
        const sql = `UPDATE product SET Describle = '${Describle}' WHERE ID=${ID}`;
        console.log(sql);
        const rows = await db.load(sql);
        console.log(sql);
    }

};