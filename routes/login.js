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
router.post('/', function(req,res,next){
  var username = req.body.username;
  var cmp = req.body.password;
  pool.getConnection(function(err, conn){
    var sql = "select passwd from user_data where id=?";

    conn.query(sql,[username], function(err, result){
      console.log(result[0].passwd);
      console.log(cmp);
      if(err) {res.send("not user");}
      else if(cmp!=result[0].passwd)  // passwd 찾았고 다름
      {res.send("passwd error");}
      else
      {console.log("3");res.redirect("/shop");}
    });
  });

//  res.render('login');
//  console.log(req.body);
});

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
