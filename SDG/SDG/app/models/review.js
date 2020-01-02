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
    reviewBidder: async (id,sellerID,Vote,comment) => {
        const sql = `INSERT INTO sellerreviewtobidder(bidderID,sellerID, Vote, comment) VALUES (${id},${sellerID},${Vote},${comment})`;
        console.log(sql);
        const rows = await db.load(sql);
        return rows;
    },
};





