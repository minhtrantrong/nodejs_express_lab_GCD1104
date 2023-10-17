var express = require('express');
var router = express.Router();
var authenticate = require('../models/authen');
var display_products = require('../models/display_table');
var crud = require('../models/db_crud');
var select_options_form = require('../models/select_options_form');
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
  req.session.refresh_time = 5000;
  req.session.user_name = user_name;
  auth_result = await authenticate(user_name, pass_word);
  req.session.shop = auth_result.shop;
  if (auth_result.auth) {
    if (auth_result.shop == 'director') {
      res.redirect('/users/director');
    } else {
      res.redirect('/users/profile');
    } 
  }
  else {
    res.render('login', {title: "Login Page", message: "Wrong username or password, please try again"})
  }
});

/* GET users/profile. */
router.get('/profile', async function(req, res, next) {
  let user_name = req.session.user_name;
  let shop = req.session.shop;
  // console.log(req.session.user_name);
  if (user_name) {
    let table_html = await display_products("products", user_name, shop, 0);
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

/* GET /users/director. */
router.get('/director', async function(req, res, next) {
  let user_name = req.session.user_name;
  let shop = req.session.shop;
  let shop_id = (req.session.shop_selected)? req.session.shop_selected : 0;
  console.log(`shop id: ${shop_id}`);
  // check interval time in session
  let interval = 5000;
  if (req.session.interval) {
    interval = req.session.interval*1000;
  }
  let select_html = await select_options_form();
  if (user_name) {
    let table_html = await display_products("products", user_name, shop, shop_id);
  res.render('director', {
    title: "Director Page", 
    product_table: table_html, 
    select_form: select_html, 
    interval: interval});
  }
  else {
    res.redirect('/users/login');
  }
});

/* Route for select shop, POST */ 
router.post('/director', async function(req, res, next) {
  req.session.shop_selected = req.body.shop_selected;
  res.redirect('/users/director')
});
/* Route for select refreshtime, POST */ 
router.post('/refreshtime', async function(req, res, next) {
  req.session.interval = req.body.interval;
  res.redirect('/users/director');
});

module.exports = router;
