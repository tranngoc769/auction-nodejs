const db = require("../utils/db");
const tb_account = "bidderreviewtoseller";

module.exports = {
  getReviewBySellerID: async id => {
    const sql = `SELECT  *
                     FROM bidderreviewtoseller
                     WHERE sellerID = ${id}`;
    //console.log(sql);
    const rows = await db.load(sql);
    console.log("token:", rows);
    return rows;
  },
  addReview: async (bidderID, sellerID, comment) => {
    const sql = `SELECT  *
                     FROM bidderreviewtoseller
                     WHERE sellerID = ${sellerID} and bidderID = ${bidderID}`;
    //console.log(sql);
    const rows = await db.load(sql);
    if (rows.length <= 0) {
      const sql = `insert into bidderreviewtoseller (bidderID, sellerID, comment)
        values
        (${bidderID}, ${sellerID}, '${comment}')`;
      //console.log(sql);
      await db.load(sql);
    }
  }
};
