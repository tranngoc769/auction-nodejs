const db = require("../utils/db");
const tb = "history";

module.exports = {
  addToHistory: async (userID, proID, price) => {
    const sql = `insert into ${tb} (userID, proID, dateBid, price)
            values 
            (${userID}, ${proID}, curdate(), ${price})`;
    console.log(sql)
    await db.load(sql);
  },
  getHistoryByProductID: async (proID) => {
    const sql = `select * 
    from history
    where history.proID = ${proID}`;
    //console.log(sql);
    const rows = await db.load(sql);
    return rows
  },
  findBidderbyProID: async (proID) => {
    
    const sql = `SELECT *  FROM history JOIN  user_info
    ON history.userID = user_info.accountID
    WHERE proID = ${proID}
    
    ORDER BY dateBid DESC`;
    const rows = await db.load(sql);
    return rows;
  },
};
