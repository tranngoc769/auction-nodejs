const db = require('../utils/db');
const tb = 'watchlist';

module.exports = {
    addToWatchList: async (userID, proID) => {
        //check if exist
        const sql = `SELECT  *
                     FROM ${tb} 
                     WHERE userID = ${userID} and proID = ${proID}`;
        ////console.log(sql);
        const rows = await db.load(sql);
        if(rows.length <= 0){   //not exist then insert
            const sql = `insert into WatchList (userID, proID)
            values 
            (${userID}, ${proID})`;
            await db.load(sql);
        }
    },
};
