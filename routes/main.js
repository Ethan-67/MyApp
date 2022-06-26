module.exports = function(app) 
{
	// saves userId to global variable	
	var userId;
	const redirectLogin = (req, res, next) => { 
		if (!req.session.userId) {
			res.redirect('./login')
		} else {
			// user id saved if it is found 
			userId = req.session.userId; 
			next(); 
		}
	}

	const { check, validationResult } = require('express-validator');

	// render index page
	app.get('/', function(req, res) {
		res.render('index.html')
	});

	app.get('/api', function (req,res) {
     		var MongoClient = require('mongodb').MongoClient;
     		var url = 'mongodb://localhost';
     		MongoClient.connect(url, function (err, client) {
     			if (err) throw err                                                                                                                                                
     				var db = client.db('mycaloriedb');                                                                                                                                                                   
      			db.collection('food').find().toArray((findErr, results) => {                                                                                                                                
      			if (findErr) throw findErr;
      			else
         			res.json(results);                                                                                                                                             

      			client.close();                                                                                                                                                   
  			});
		});
	});

	// render about page 
	app.get('/about', function(req, res) {
		res.render('about.html');
	});

	// render search page 
	app.get('/searchfood', redirectLogin, function(req, res) {
		res.render("searchfood.html")
	});

	// display search results  
	app.get('/search-result', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost';
		// store search query from webpage  
		var query = req.query.keyword;
		// connecto to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 
			// get database
			var db = client.db('mycaloriedb');
			// find all documents resembling query return as an array 
			db.collection('food').find({name: {$regex: query}}).toArray((findErr, results) => {
				if (findErr) throw findErr; 
				else /* send results array to ejs to display to webpage */  
					res.render('search-result.ejs', {items: results});
			client.close();
			});
		});
	});

	// render search page 
	app.get('/updatesearchfood', redirectLogin, function(req, res) {
		res.render("searchupdatefood.html")
	});

	// display search results  
	app.get('/updatesearch-result', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost';
		// store search query from webpage  
		var query = req.query.keyword;
		// connecto to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 

			// get database
			var db = client.db('mycaloriedb');
			// find all documents resembling query return as an array 
			db.collection('food').findOne({name: query}, function(findErr, obj) {
				if (findErr) {
					throw findErr; 
				}
				else {	/* send results array to ejs to display to webpage */  
					// check if food found
					if (obj != null) 
						res.render('updatesearch-result.ejs', {'item': obj});
					else 
						res.send("food not found");
				}
			// close connection
			client.close();
			});
		});
	});
	
	// update food from db
	app.post('/updatedfood', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost';
		// store search query from webpage  
		var query = req.body.name;
		// connecto to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 

			// get db
			var db = client.db('mycaloriedb');
			
			// if user id matches user added update it
			if (userId == req.body.userAdded) {
			db.collection('food').update({name: query}, req.body, function(err, obj) {
				if (err) throw err; 	
				
				// close connection
				client.close();
				// send confirmation
				res.send('Record Updated, Name: ' + req.body.name + '<br><a href='+'./'+'>Home</a>');
			})
			}else {
				// close connection
				client.close();
				// send confirmation
				res.send('Only user who added item can update it, Item: ' + req.body.name + ' User added: ' + req.body.userAdded + '<br><a href='+'./'+'>Home</a>');
			}
		})
	});

	// delete food from update food page 
	app.post('/deletefood', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost';
		// store search query from webpage  
		var query = req.body.name;

		// connecto to mongo 
		MongoClient.connect(url, function(err, client) {
			// if error throw it 
			if (err) throw err; 
			
			// get db 
			var db = client.db('mycaloriedb');
			
			// if userid matches user who added food delete food  
			if (userId == req.body.userAdded) {
			// delete from db
			db.collection('food').deleteOne({name: query}, function(err, obj) {
				if (err) throw err; 

				// close connection
				client.close();
				// send confirmation 
				res.send('Record deleted, Name: ' + obj.name + '<a href='+'./'+'>Home</a>');
			});
			} else {
				// close connection
				client.close();
				// send confirmation
				res.send('Only user who added item can delete it, Item: ' + req.body.name + ' User added: ' + req.body.userAdded + '<br><a href='+'./'+'>Home</a>');
			} 
		});
	});	
	
	// render login page 
	app.get('/login', function(req, res) {
		res.render('login.html'); 	
	}); 
	
	
	app.post('/loggedIn', function(req, res) {
		// import bcrypt 
		const bcrypt = require('bcrypt'); 
		// initialise salt value 
		const saltRounds = 10; 
		// store plain password entered on login page 
		const plainPassword = req.body.password;
	
		// import mongo
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost'; 

		// connect to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 
	
			// get database
			var db = client.db('mycaloriedb');
			// get subdocuments with same username as inputted on search page 
			db.collection('users').find({username: req.body.username}).toArray((findErr, results) => {
				if (findErr) throw findErr; 

				// stores if the username and password has been checked 
				var isChecked = false; 

				// loop iterates through results 
				for (var i = 0; i < results.length; i++) {
					console.log('length: ' + results.length + ' i: ' + i); 
					// isChecked = true  
					isChecked = true; 
					// individual sub documents accessible through doc 
					var doc = results[i];
					// compare password from web page to hashed password from db 
					bcrypt.compare(plainPassword, doc.password, function(err, result) {
    						// if result == true ...
						if (result == true) { 
							req.session.userId = req.body.username;
							res.send("logged in" + '<br />'+'<a href='+'./'+'>Home</a>'); 
							client.close(); 
							//isValid = true; 
							return; 
						} else {
							// res.send("Invalid Login" + '<br />'+'<a href='+'./'+'>Home</a>'); 
						}
					});
				} 
				// if credientials havent been checked send a confirmation, this prevents a response being sent to user after one has already been sent 
				if (!isChecked ) {
					res.send("Invalid Login" + '<br />'+'<a href='+'./'+'>Home</a>'); 
				}
				client.close();
				return; 
			});
		}); 
	});

	// logs user out of web app
	app.get('/logout', redirectLogin, (req, res) => { 
		// destroy session 
		req.session.destroy(err => { 
			if (err) {	
				return res.redirect('./') 
			}
		// send confirmation
		res.send('you are now logged out. <a href='+'./'+'>Home</a>');
		})
	})

	// render register page 
	app.get('/register', function(req, res) {
		res.render('register.html');
	});

	// upload user to db send confirmation page
	app.post('/registered', [check('email').isEmail()], [check('password').isLength({min: 6})],  function(req, res) {
		// get errors 
		const errors = validationResult(req);

		// redirect if error detected 
		if (!errors.isEmpty()) {
			res.redirect('./register')
		}
		else {
		// import bcrypt 
		const bcrypt = require('bcrypt'); 
		// initialise salt value 
		const saltRounds = 10; 
		// get password entered from web page 
		const plainPassword = req.body.password;
		
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost'; 
	
			
		// connect to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 
			
			// get db 
			var db = client.db('mycaloriedb');

			// hash password entered from page 
			bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {		
				if (hashedPassword == undefined) 
					return; 				

				// insert into document hashed password and other credientials 
				db.collection('users').insertOne({
					username: req.body.username,  
					password: hashedPassword,
					email: req.body.email,
					firstname: req.body.firstname, 
					lastname: req.body.lastname
				});

				// close connection 
				client.close(); 
				// send confirmation
				res.send(' This user is added to the database, name: ' + req.body.username + ' Plain Password ' + " " + req.body.password + " hashedPassword " + hashedPassword+ '<br />'+'<a href='+'./'+'>Home</a>'); 
			})

		});
		}
	}); 
	
	// lists all foods from db 
	app.get('/listfood', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost';
		
		// connect to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 

			// get db 
			var db = client.db('mycaloriedb');

			// return all foods from db 
			db.collection('food').find().toArray((findErr, results) => {
				if (findErr) throw findErr; 
				else	/* send results to ejs to be displayed */  
					res.render('listfood.ejs', {availablefood:results});
			// close connection
			client.close();
			});
		});
	});

	// render add food page 
	app.get('/addfood', redirectLogin, function(req, res) {
		// render addfood html 
		res.render('addfood.html')
	});

	// adds foods to db sends a confirmation 	
	app.post('/foodadded', function(req, res) {
		// import mongo 
		var MongoClient = require('mongodb').MongoClient;
		// path to mongo 
		var url = 'mongodb://localhost'; 
		// log userid 
		console.log("User ID: " + userId); 
		
		// connect to mongo 
		MongoClient.connect(url, function(err, client) {
			if (err) throw err; 

			// get db
			var db = client.db('mycaloriedb');
			
			// insert book to books document
			db.collection('food').insertOne({
				name: req.body.name, 
				typicalValues: req.body.typicalValues,
				typicalValueUnit: req.body.typicalValueUnit, 
				calories: req.body.calories, 
				carbs: req.body.carbs, 
				fat: req.body.fat, 
				protein: req.body.protein,
				salt: req.body.salt, 
				sugar: req.body.sugar,
				userAdded: userId
			});
			// close connection 
			client.close(); 
			// send confirmation
			res.send(' This food was added to the database, name: ' + req.body.name + ' calories: ' + req.body.calories +'<br />'+'<a href='+'./'+'>Home</a>'); 
			});
		}); 

	// unimplemented R9C
	function resolveAfter2Seconds() {
  		return new Promise(resolve => {
    			setTimeout(() => {
      			resolve('resolved');
   			 }, 1000);
  		});
	}

	// unimplemented R9C
	var checkBoxArr = [[]]; 
	async function findOne(req, count, quantity) {
		console.log("findOne: begin");
		var MongoClient = require('mongodb').MongoClient;
		var url = 'mongodb://localhost';

		const client = await MongoClient.connect(url)
			.catch(err => {console.log(err)});

		if (!client) 
			return; 

		console.log("findOne: null check");
		
		try {
			let db = client.db("mycaloriedb");
			let collection = db.collection('foods');
			var arr = [[]]; 

			var res1;
			console.log("findOne: await begin");	
				
			//let result = await collection.find({name: req.body.checkbox[count]}); 
			//console.log("findOne: result: " + JSON.stringify(result));
			const res = await db.collection('food').findOne({name: req.body.checkbox[count]}, function(findErr, item) {
				if (findErr) throw findErr; 

				checkBoxArr.push({name: item.name, 
					calories: item.calories *quantity, 
					carbs: item.carbs * quantity,
					fats : item.fat * quantity, 
					proteins: item.protein *quantity, 
					salts: item.salt * quantity, 
					sugars: item.sugar * quantity
				});

				client.close(); 
			});		
			console.log("findOne: await end");
		} catch (err) {
			console.log(err); 
		}
		
	}
		
	// unimplemented R9C
	app.post('/displayfood', async function(req, res) {
		res.send("Unimplemented " + '<br />'+'<a href='+'./'+'>Home</a>'); 
	});
	

}
