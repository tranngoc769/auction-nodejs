const db = require("../utils/db");

module.exports = {
  banProfromUser: async (us, pro) => {
    const sql = `insert into Banned values (${us},${pro})`;
    console.log(sql)
    await db.load(sql);
  },
};
