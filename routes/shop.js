var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'chlwodms*1',
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

router.get('/c', function(req, res, next){
  res.render('check');
});

router.get('/login', function(req, res, next){
  res.render('login');
});




router.get('/joinform', function(req, res, next){
  res.render('joinform');
});

router.post('/joinform', function(req, res, next){
  console.log("hi");
  var id = req.body.username;
  var passwd = req.body.password;
  var birth = req.body.birth;
  var email = req.body.email;
  var property = "buyer"
  var data = [id, passwd, birth, email, property];

  pool.getConnection(function(err, conn){
    if(err) console.error("join router error : "+ err);
    var q = "insert into user_data(id, passwd, birth, email, property) values(?,?,?,?,?)";
    conn.query(q, data, function(err, rows){
      if(err) console.error("join router query error : " + err);
      res.redirect('/shop/login');
      conn.release();
    });
  });
});



module.exports = router;
