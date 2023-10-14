var express = require('express');
var router = express.Router();

var display_results = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cloud Computing Class',  results: display_results });
});
/* POST method on input form */
router.post('/', function(req, res, next) {
  let num = parseInt(req.body.input_num);
  display_results = `<ul>`; 
  for (let i=0; i <= num; i++)
  {
    display_results += `<li> ${i} </li>`;
  }
  display_results += `</ul>`;
  res.render('index', { title: 'Cloud Computing Class', results: display_results });
});

module.exports = router;
