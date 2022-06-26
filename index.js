var express = require('express')
var bodyParser = require('body-parser')
var pug = require('pug')
var session = require('express-session')
var validator = require('express-validator') 

//const mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mybookshopdb";


const app = express()
const port = 8000

MongoClient.connect(url, function(err, db) {
	if (err) throw err; 
	console.log("Database created!"); 
	db.close();
});

app.use(session({
	secret: 'somerandomstuffs',
	resave: false, 
	saveUnitialized: false, 
	cookie: {
		expires: 600000
	}
}));


app.use(bodyParser.urlencoded({ extended: true}))
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'pug');

app.listen(port, () => console.log(`Example app listening on port ${port}`))
