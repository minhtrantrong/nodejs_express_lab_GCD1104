var express = require('express');
var router = express.Router();
var authenticate = require('../models/authen');
var display_products = require('../models/display_table');
var crud = require('../models/db_crud');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {title: "User Page"});
});
/* GET users/login. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: "Login Page", message: ""});
});

/* GET users/logout. */
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/users');
});

/* POST from login form */
router.post('/login', async function(req, res, next) {
  let user_name = req.body.uname;
  let pass_word = req.body.pword;
  req.session.user_name = user_name;

  if (await authenticate(user_name, pass_word)) {
    res.redirect('/users/profile');
  }
  else {
    res.render('login', {title: "Login Page", message: "Wrong username or password, please try again"})
  }
});

/* GET users/profile. */
router.get('/profile', async function(req, res, next) {
  let user_name = req.session.user_name;
  // console.log(req.session.user_name);
  if (user_name) {
    let table_html = await display_products("products", user_name);
  res.render('profile', {title: "Profile Page", product_table: table_html});
  }
  else {
    res.redirect('/users');
  }
});
/* POST CRUD */
router.post('/crud', async function(req, res, next) {
  let body = req.body;
  // Call a function to query CRUD
  await crud(body);
  res.redirect('/users/profile');
});
module.exports = router;
