const mysql = require('mysql');
function connectToSring() {
    return mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        database: 'auction'
    });
}

exports.load = sql => {
    return new Promise((resolve, reject) => {
        //throw new Error(' just happen right now :(');
        const con = connectToSring();
        con.connect(err => {
            if (err) {
                reject(err);
            }
            //console.log("Connected!");
        });
        con.query(sql, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
        con.end();
    });
};
