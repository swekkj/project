var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'PASSWORD',
  database: 'swe',
  connectionLimit: 5,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err,conn){
    if(err) console.error("poll connection error : " + err);
    conn.query("SELECT * FROM game", function(err,rows){
      if(err) console.error("query error : " + err);
      res.render('shop',{title: 'Shop', rows: rows});
      conn.release();
    });
  });
});
router.get('/:name',(req,res,next)=>{
  var idx = req.params.name;
  pool.getConnection((err,conn)=>{
    if(err) console.error("connection err : "+err);
    var sqlQuery = "SELECT idx, creator_id, title, content, filePath, hit FROM board WHERE idx=?";
    conn.query(sqlQuery, [idx], (err,rows)=>{
      if(err) console.error("query err : " + err);
      res.render('read',{title:"글 조회",row:rows[0]});
      conn.release();
    });
  });
});
module.exports = router;
