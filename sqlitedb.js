var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "userdb.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
   if (err) {
      console.error(err.message)
      throw err
   }else{
      console.log('Connected to the SQLite database.')
      db.run(`CREATE TABLE user (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username text, 
         password text, 
         token text 
         )`,
            (err) => {
               if (err) {
                  console.log(err);
               }else{
                  var insert = 'INSERT INTO user (username, password, token) VALUES (?,?,?)'

                  db.run(insert, ['Gary', 'admin', '12345678'])
                  db.run(insert, ['Jose', 'admin2', '87654321'])
                  db.run(insert, ['Fulano', 'admin3', '12481632'])
               }
            }
      );  
   }
});

module.exports = db