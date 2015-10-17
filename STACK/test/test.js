//init chance in order to create random strings
var Chance 		= require('chance');
var chance 		= new Chance();
//for making requests
var request 	= require('superagent');
var http 		= require('http');
var expect 		= require('chai').expect;
var User 		= require('../app/models/userModel.js');
var should 		= require('should');
var fakeUser 	= request.agent();

//init db
var db	 		= require('mongoose');
//connect to database
db.connect('mongodb://chocof:choco@ds035583.mongolab.com:35583/mysearchdb');




describe('================== mySearch API ==================\n\n',function(){
	var tester;        //Fake User to test API with
	var notYetHashed; //User password before hashing
	var cookie;		 //Cookie to use through the session
	var fakeCookie = "I'm A Little Fake Cookie"; //Fake cookie to test security
	
	//before anything happens create fake user 
	before('Create and log fake User in',function(done){
		this.timeout(20000)
		//create fake user with fake credentials with fake fakity fakes fakers ....
		tester = new User({	email 		: chance.email({domain: 'test.com'}),
								password 	: chance.string(),
								username	: chance.first(),
								name		: chance.first(),
								surname		: chance.second(),
								age  		: chance.age()
								})
		
		//store unhashed password
		notYetHashed = tester.password;

		//now hash and store new password
		tester.password = tester.generateHash(notYetHashed);

		//save tester
		tester.save(function(err){
			
			//see if password is valid
			expect(tester.validPassword(notYetHashed)).to.equal(true)
			
            //now login user
            request
                .post('http://localhost:8000/api/v1/login')
                .send({
                    password: notYetHashed , username: tester.username
                })
				.type('form')
	            .end(function(err, res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(200);
	                expect(res.body.successMessage).to.contain("You successfully logged in!!!");
	                cookie = res.headers['set-cookie'];
	                done();
	        	})
		})
	});
	


	after(function (done,err) {
        //Remove User and close connection with Database
        User.remove({_id:tester._id}).exec(function(err){
            expect(err).to.not.exist;
	            db.connection.close(function (err) {
	               expect(err).to.not.exist;
	               done();
		    	});
		    });
	});



	describe('------API api/v1/login------',function(){
		
		it('Should log in registered users with valid email',function(done){
	        request
	            .post('http://localhost:8000/api/v1/login')
	            .send({
	                password: notYetHashed , username: tester.email
	            })
	            .end(function(err,res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(200);
	                expect(res.body.successMessage).to.contain("You successfully logged in!!!")
	                done();
	            });
	    });

		it('Should log in registered users with valid username',function(done){
	        request
	            .post('http://localhost:8000/api/v1/login')
	            .send({
	                password: notYetHashed , username: tester.username
	            })
	            .end(function(err,res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(200);
	                expect(res.body.successMessage).to.contain("You successfully logged in!!!")
	                done();
	            });
	    });

		it('Should block non-registered users',function(done){
	        request
	            .post('http://localhost:8000/api/v1/login')
	            .send({
	                password: 'wrong_password' , username: 'wrong@email'
	            })
	            .end(function(err,res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(400);
	                expect(res.body.errorMessage).to.contain("Couldn't Login")
	                done();
	            });
	    });

	    it('Should block users with wrong password',function(done){
	        request
	            .post('http://localhost:8000/api/v1/login')
	            .send({
	                password: 'wrong_password' , email: tester.username
	            })
	            .end(function(err,res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(400);
	                expect(res.body.errorMessage).to.contain("Couldn't Login")
	                done();
	            });
	    });

		
	});

	describe('------API api/v1/signup------',function(){
		this.timeout(20000)

		it('Should succesfully sign-up new users',function(done){
	        var newUser= User({
				email 		: 	chance.email({domain : 'foo.com'}),
				password 	: 	chance.string(),
				username	: 	chance.first() 
			});	

	        request
	            .post('http://localhost:8000/api/v1/signup')
	            .send({
	                password: newUser.password , 
	                email: newUser.email,
	                username : newUser.username
	            })
	            .end(function(err,res){
	                expect(res).to.exist;
	                expect(res.status).to.equal(200);
	                expect(res.body.successMessage).to.contain("You successfully signed up")
	                //delete user now
	                User.remove({_id : newUser._id}).exec(function(err){
	                	expect(err).to.not.exist;
	                	done();
	                })
	            });
	    });


		it('Block Users with the same email',function(done){
	    	request
	            .post('http://localhost:8000/api/v1/signup')
	            .send({
	                password: tester.password , 
	                email: tester.email,
	                username : chance.first()
	            })
	            .end(function(err,res){
	                expect(err).to.exist;
	                expect(res.status).to.equal(400);
	                done();
	                })
	    });

	    it('Block Users with the same username',function(done){
	    	request
	            .post('http://localhost:8000/api/v1/signup')
	            .send({
	                password: tester.password , 
	                email: chance.email({domain : "doubleuser.com"}),
	                username : tester.username
	            })
	            .end(function(err,res){
	                expect(err).to.exist;
	                expect(res.status).to.equal(400);
	                done();
	            })
	    });
	});
	
	describe('------API api/v1/user------',function(){
		this.timeout(20000)

		describe('GET Request',function(){

			it('Should only allow authorized users',function(done){
		        request
		            .get('http://localhost:8000/api/v1/user')
		            .set('cookie',fakeCookie)
		            .end(function(err,res){
		                expect(err).to.exist;
		                expect(res.status).to.equal(401);
		                expect(err.body.message).to.equal("You are not authorized to access this content");
		                done();		               
		            });
		    });
		
			it('Should get valid user data',function(done){
		        
				request
		            .get('http://localhost:8000/api/v1/user')
		            .set('cookie',cookie)
		            .end(function(err,res){
		                expect(res).to.exist;
		                expect(res.status).to.equal(200);
		                expect(res.body.info.email).to.equal(tester.email)
		                expect(res.body.info.username).to.equal(tester.username)
		                expect(res.body.info.name).to.equal(tester.name)
		                expect(res.body.info.surname).to.equal(tester.surname)
		                expect(res.body.info.age).to.equal(tester.age)
						done();		               
		            });
		    });
		});	
	})
});