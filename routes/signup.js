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

router.get('/', function(req, res, next){
    res.render('signup');
});
router.post('/', function(req, res, next){
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
      res.redirect('/login');
      conn.release();
    });
  });
});



module.exports = router;
