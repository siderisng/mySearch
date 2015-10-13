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


	//send to profile
	app.get('/mainMenu',function(req,res){
		
		res.render('mainMenu.jade');	
		
	})

	//send to edit user
	app.get('/profile',function(req,res){
		
		res.render('menu.jade');	
		
	})

	app.get('/edit',function(req,res){
		
		res.render('edit.jade');	
		
	})

	//send to users' maps and stats
	/* TODO 
	app.get('menu/maps',function(req,res){

		res.render('menuMaps.jade');

	})
	*/


	//redirect unknown requests to home
	app.get('*',function(req,res){

		res.render('mainView.jade')
	})



}