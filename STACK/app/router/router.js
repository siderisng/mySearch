/*
	This is our beloved router
	Does all the routing as you would expect
*/
module.exports = function(app) {

	//home is the login-signup page
	app.get('/documentation',function(req,res){

		res.sendfile('./doc/doc.html')

	})

	//home is the login-signup page
	app.get('/home',function(req,res){

		res.render('homeView.jade')

	})


	//send to edit user
	app.get('/profile',function(req,res){
		
		res.render('menu.jade');	
		
	})

	//send to edit user
	app.get('/info',function(req,res){
		
		res.render('info.jade');	
		
	})

	app.get('/edit',function(req,res){
		
		res.render('edit.jade');	
		
	})

	//send to edit user
	app.get('/statistics',function(req,res){
		
		res.render('statistics.jade');	
		
	})

	app.get('/maps',function(req,res){
		
		res.render('maps.jade');	
		
	})

	//redirect unknown requests to home
	app.get('*',function(req,res){

		res.render('mainView.jade')
	})



}