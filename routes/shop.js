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
router.post('/',function(req,res,next){
    var username = req.body.username;
    var cmp = req.body.password;
    console.log(username);
    console.log(cmp);

    pool.getConnection(function(err, conn){
      var sql = "SELECT passwd FROM user_data where id=?";
      conn.query(sql,[username], function(err, result){
        if(err) console.error("find user err : "+err);
        if(result.length==0) res.send("not user");
        else if(cmp!=result[0].passwd)  // passwd 찾았고 다름
        {res.send("passwd error");}
        else
        {
          conn.query("SELECT * FROM game", function(err,game_rows){
            if(err) console.error("game list query error : " + err);
            conn.query("SELECT * FROM bucket",function(err,bucket_rows)
            {
              if(err) console.error("bucket query error : "+err);
              res.render('login_shop',{title: 'Shop', rows: game_rows, user:username, bucket:bucket_rows});
              conn.release();
            });
          });
        }
    });
  });
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

router.get('/:name',function(req,res,next){
  var username=req.params.username;
  var name = req.params.name;
  pool.getConnection(function(err,conn){
    if(err) console.error("poll connection error : " + err);
    conn.query("select * from bucket where name=?",[name],function(err,rows){
      if(err) console.error("search error" + err);
      console.log(rows);
      if(rows.length == 0)
      {
        var sql = "insert into bucket(name,price,image,idx) select name,price,img1,idx from game where name=?";
        conn.query(sql,[name],function(err,rows){
          if(!err) console.error("insert error : " + err);
          console.log(name + " is on the bucket");
          conn.query("SELECT * FROM game", function(err,game_rows){
            if(err) console.error("game list query error : " + err);
            conn.query("SELECT * FROM bucket",function(err,bucket_rows)
            {
              if(err) console.error("bucket query error : "+err);
              res.render('login_shop',{title: 'Shop', rows: game_rows, user:username, bucket:bucket_rows});
              conn.release();
            });
          });
        });
      }
    });
  });
});

router.get('/detail/bucket/:idx', function(req, res, next){
  var name = req.params.idx;
  console.log("123" + name);
  pool.getConnection(function(err, conn){
    var sql = "insert into bucket(name,price,image,idx) select name,price,img1,idx from game where idx=?";
    conn.query(sql,[name],function(err,rows){
      if(err) console.error("insert error : " + err);
      res.redirect('/order');
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
