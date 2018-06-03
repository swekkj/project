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
router.post('/',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
});
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
/*
router.get('/:name',(req,res,next)=>{
  var idx = req.params.name;
  console.log(idx);
  pool.getConnection((err,conn)=>{
    if(err) console.error("connection err : "+err);
    var sqlQuery = "SELECT * FROM game_detail WHERE name=?";
    conn.query(sqlQuery, [idx], (err,rows)=>{
      if(err) console.error("query err : " + err);
      console.log(rows[0]);
      res.render('detail',{title:"detail",row:rows[0]});
      conn.release();
    });
  });
});*/
module.exports = router;
