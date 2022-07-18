import session from 'express-session'
var MySQLStore = require('express-mysql-session')(session);


// Database MySql Config
var options = {
  host: 'localhost',
  port: 3306,
  user: 'adam',
  password: 'password',
  database: 'elzero',
};

// Initial Store Session using Mysql Database; 
var sessionStore = new MySQLStore(options);


// Session Optiones
export const sessionOptions : session.SessionOptions = {
  secret: "good and good",
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
  cookie: {
    maxAge:40000,
  }
}




