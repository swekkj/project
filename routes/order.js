var express = require('express');
var router = express.Router();
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
  pool.getConnection(function(err, conn){
    if(err) console.error("pool connect error : " + err);
    var sql = "SELECT * FROM bucket";
    conn.query(sql,function(err, result){
      if(err) console.error('query connect error : ' + err);
      res.render('order', { title: '구매', bucketList: result });
      conn.release();
    });
  });
});

router.get('/detail/:idx',function(req,res,next){
  pool.getConnection(function(err,conn){
    if(err) console.error("poll connection error : " + err);
    var idx = req.params.idx;
    var sql = "select * from game where idx=?";
    conn.query(sql,[idx],function(err, rows){
      res.render('detail',{rows:rows});
      conn.release();
    });
  });
});

module.exports = router;
