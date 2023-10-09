var express = require("express")
var cors = require('cors')
var db = require("./sqlitedb.js")

var app = express()
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000 
app.listen(HTTP_PORT, () => {
   console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get("/api/user", (req, res, next) => {
   var sql = "select * from user"
   var params = []
   db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json(rows)
     });

});

app.get("/api/user/:id", (req, res, next) => {
   var sql = "select * from user where id = ?"
   var params = [req.params.id]
   db.get(sql, params, (err, row) => {
      if (err) {
         res.status(400).json({"error":err.message});
         return;
      }
      res.json(row)
   });
});

app.post("/api/user/", (req, res, next) => {
   var errors=[]
   if (!req.body.username){
      errors.push("No username specified");
   }
   var data = {
      username : req.body.username,
      password: req.body.password,
      token: req.body.token,
   }
   var sql = 'INSERT INTO user (username, password, token) VALUES (?,?,?)'
   var params =[data.username, data.password, data.token]
   db.run(sql, params, function (err, result) {
      if (err){
         res.status(400).json({"error": err.message})
         return;
      }
      data.id = this.lastID;
      res.json(data);
   });
})

app.put("/api/user/:id", (req, res, next) => {
   var data = {
      username : req.body.username,
      password: req.body.password,
      token: req.body.token
   }
   db.run(
      `UPDATE user SET
         username = ?, 

         password = ?,
         token = ?`, 
            [data.username, data.password, data.token],
      function (err, result) {
         if (err){
            console.log(err);
            res.status(400).json({"error": res.message})
            return;
         }
         res.json(data)
   });
})

app.delete("/api/user/:id", (req, res, next) => {
   db.run(
      'DELETE FROM user WHERE id = ?',
      req.params.id,
      function (err, result) {
         if (err){
            res.status(400).json({"error": res.message})
            return;
         }
         res.json({"message":"deleted", changes: this.changes})
   });
})

app.use(function(req, res){
   res.status(404);
});