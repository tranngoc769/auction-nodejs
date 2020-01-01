const db = require("../utils/db");
const tb_product = "product";

module.exports = {
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
