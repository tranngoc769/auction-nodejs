const db = require('../utils/db');
const tb_account = 'sellerreviewtobidder';

module.exports = {
    getReviewByBidderID: async (id) => {
        const sql = `SELECT  *
                     FROM ${tb_account} 
                     WHERE bidderID = ${id}`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows;
    },
    getNumberOfGoodReview: async (id) => {
        const sql = `SELECT  *
                     FROM ${tb_account} 
                     WHERE bidderID = ${id} AND Vote = 1`;
        //console.log(sql);
        const rows = await db.load(sql);
        console.log("token:", rows);
        return rows.length;
    },
};