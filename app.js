require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));

//custom flash fun
app.use((req, res, next) => {
  res.locals.success_msg = req.session.flash ? req.session.flash.success : null;
  res.locals.error_msg = req.session.flash ? req.session.flash.error : null;
  req.flash = (type, msg) => {
    req.session.flash = { [type]: msg };
  };
  
  if (req.session.flash) {
    res.locals.success_msg = req.session.flash.success;
    res.locals.error_msg = req.session.flash.error;
    delete req.session.flash;
  }
  
  res.locals.user = req.session.user || null;
  next();
});

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

app.use('/', require('./routes/home'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('errors/404', { title: '404 Not Found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
