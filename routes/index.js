var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
    // res.render('index', {title: 'Blockchain Demo'});
    res.render('hash', {page: 'hash'/*, title: 'Hash Demo'*/});
});

router.get('/:page', function(req, res, next)
{
    console.log(req.params);
    var page = req.params.page;
    res.render(page, {page: page/*, title: 'Hash Demo'*/});
});

module.exports = router;
