const db = require("../utils/db");
const tb = "history";

module.exports = {
  addToHistory: async (userID, proID, price) => {
    const sql = `insert into ${tb} (userID, proID, dateBid, price)
            values 
            (${userID}, ${proID}, curdate(), ${price})`;
    console.log(sql)
    await db.load(sql);
  }
};
