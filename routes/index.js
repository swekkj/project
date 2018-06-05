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

router.post('/',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
});
router.get('/', function(req, res, next) {
  res.render('index',{title : "index"});
});

module.exports = router;
