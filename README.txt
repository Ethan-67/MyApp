README 

R1: 
	A/B - views/index.html 

R2: 
	A - view/about.html

R3: 
	A - views/register.html
	B - routes/main.js 
		linenumber:	257 - 306 
		data input:	292 - 297
	C - routes/main.js 
		ln:	303 

R4: 
	A - views/login.html 
	B - routes/main.js 
		ln:	177 - 237 
		check credientials:	218 
	C - routes/main.js  
		ln:	220
		parital completion  

R5: 
	routes/main.js 
		ln:	240 - 249

R6: 
	A - views/addfood.html 
	B - routes/main.js 
		ln: 	335 - 375
		data input: 358 - 369 
	C - routes/main.js 
		ln: 373

R7: 
	A - views/searchfood.html
	B - routes/main.js 
		ln: 	43 - 69
		find query: 62 - 67 
		ejs input: 65 
	C - search regex: 62

R8: 
	A - views/searchupdatefood.html
	B - views/updatesearch-result.ejs 
		routes/main.js 
			ln: 72 - 137
			checkUserId to update: 124 
	C- routes/main.js 
		ln: 143 - 177 
			checkUserId to delete: 160  

R9: 
	A - views/listfood.html 
		routes/main.js 
			ln: 314 - 336 
			ejs input: 331 
	B - views/listfood.html 
	C - Unimplemented 

R10: 
	ln: 22 - 36 
		Going Beyond: Unimplemented
	
R11: 
	Partially implemented: on register route 

Database: MongoDB 	DB name: mycalorieDb  

Collections: food - stores all record on foods added to database 
		users - stores all users on database 
