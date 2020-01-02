module.exports = {
    isBanned: async (userID, proID) => {
        const sql = `SELECT  *
                     FROM Banned
                     WHERE uID = ${userID} AND pID = ${proID}`;
        ////console.log(sql);
        const rows = await db.load(sql);
        if(rows.length <= 0){
            return false
        }else{
            return true
        }
    }
}