var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/',function(req,res,next){
  res.render('login');
  console.log(req.body);
});

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
