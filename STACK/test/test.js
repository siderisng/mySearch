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

describe('^^^^^^^^^^^^^^^^^^^^^^mySearch^^^^^^^^^^^^^^^^^^^^^^',function(){
	

	after('Close Database',function(done){

		db.connection.close(function (err) {
           expect(err).to.not.exist;
           done();
		});

	})

	describe('================== mySearch API ==================',function(){
		var tester;        //Fake User to test API with
		var notYetHashed; //User password before hashing
		var cookie;		 //Cookie to use through the session
		var fakeCookie = "I'm A Little Fake Cookie"; //Fake cookie to test security
			
		//--------------------API/V1/LOGIN------------------------//

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
	        User.findByIdAndRemove(tester._id, function (err){
	    		expect(err).to.not.exist;
	            done();
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
		                cookie = res.headers['set-cookie'];
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
		                cookie = res.headers['set-cookie'];
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
		                expect(err).to.exist;
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
		                expect(err).to.exist;
		                expect(res.status).to.equal(400);
		                expect(res.body.errorMessage).to.contain("Couldn't Login")
		                done();
		            });
		    });

			
		});


		//--------------------API/V1/SIGNUP------------------------//




		describe('------API api/v1/signup------',function(){
			this.timeout(20000)

			it('Should succesfully sign-up new users',function(done){
		        var newUser ={
					email 		: 	chance.email({domain : 'foo.com'}),
					password 	: 	chance.string(),
					username	: 	chance.first() 
				}

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

		                User.remove({username : newUser.username}, function (err,noob){
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

			it('Block Users with invalid email',function(done){
		    	request
		            .post('http://localhost:8000/api/v1/signup')
		            .send({
		                password: tester.password , 
		                email: "I_don_t_know_how_to_email",
		                username : chance.first()
		            })
		            .end(function(err,res){
		                expect(err).to.exist;
		                expect(res.status).to.equal(400);
		                done();
		                })
		    });

		});
		

		//--------------------API/V1/USER------------------------//

		describe('------API api/v1/user------',function(){
			this.timeout(20000)
			////////////GET  REQUEST/////////////////
			describe('GET Request',function(){

				it('Should only allow authorized users',function(done){
			        request
			            .get('http://localhost:8000/api/v1/user')
			            .set('cookie',fakeCookie)
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(401);
			                expect(res.body.message).to.equal("You are not authorized to access this content");
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

			////////////POST REQUEST/////////////////
			describe('POST Request',function(done){
				

				it('Should only allow authorized users',function(done){
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send({data : 'No Data for you you bandit'})
			            .set('cookie',fakeCookie)
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(401);
			                expect(res.body.message).to.equal("You are not authorized to access this content");
			                done();		               
			            });
			    });

				it('Should change user data',function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: chance.email({domain : 'ch-ch-ch-changes.com'}),		
									name		: chance.first(),
									surname		: chance.last(),
									age 		: chance.age()
								}
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send(toChange)
			            .set('cookie',cookie)
			            .end(function(err,res){
			                //check if request ok
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                //get updated document	
			                User.findOne({_id : tester._id},function(err, updatedTester){
				                tester = updatedTester;
				                expect(toChange.email).to.equal(tester.email)
				                expect(toChange.username).to.equal(tester.username)
				                expect(toChange.name).to.equal(tester.name)
				                expect(toChange.surname).to.equal(tester.surname)
				                expect(toChange.age).to.equal(tester.age)
				                done();
			                })		               
			            });
			    });


				it('Should stop users trying to change their id',function(done){
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send({	id : 'edwardSnowden_ID',
			             		_id : 'Presidents_ID'})
			            .set('cookie',cookie)
			            .end(function(err,res){
			                //check if request ok
			                expect(err).to.exist;
			                expect(res.status).to.equal(400);
			                expect(res.body.errorMessage).to.equal("You can't change your id")	               
			            	done();
			            });
			    });

				it("Should not let users add data that don't exit",function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: chance.email({domain : 'ch-ch-ch-changes.com'}),		
									name		: chance.first(),
									surname		: chance.last(),
									age 		: chance.age(),
									style		: "Unique",
									title		: "Fashion-Icon",
									friends_describe_as : "god_among_humans"

								}
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send(toChange)
			            .set('cookie',cookie)
			            .end(function(err,res){
			                //check if request ok
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                //get updated document	
			                User.findOne({_id : tester._id},function(err, updatedTester){
				                tester = updatedTester;
				                expect(toChange.email).to.equal(tester.email)
				                expect(toChange.username).to.equal(tester.username)
				                expect(toChange.name).to.equal(tester.name)
				                expect(toChange.surname).to.equal(tester.surname)
				                expect(toChange.age).to.equal(tester.age)
				                expect(tester.style).to.not.exist
				                expect(tester.title).to.not.exist
				                expect(tester.friends_describe_as).to.not.exist
				                done();
			                })		               
			            });
			    });

				it("Should not let users add an invalid email",function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: "still_dont_know_how_to_email"
								}
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send(toChange)
			            .set('cookie',cookie)
			            .end(function(err,res){
			                //check if request ok
		                	expect(err).to.exist;
			                expect(res.status).to.equal(400);
			                expect(res.body.errorMessage).to.equal("This is not a valid email")
			                done();
			            });
			    });

			    it("Should allow users to change their password",function(done){
			        var toChange = {
			        				password : chance.string()
								}
					//store new password			
					notYetHashed = toChange.password			
			        request
			            .post('http://localhost:8000/api/v1/user')
			            .send(toChange)
			            .set('cookie',cookie)
			            .end(function(err,res){
			                //check if request ok
		                	expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                expect(res.body.successMessage).to.equal("Changes Saved to User")
			                //login with new password	
			                request
			                .post('http://localhost:8000/api/v1/login')
			            	.send({
			                	password: notYetHashed , username: tester.email
			            	})	
			            	.end(function(err,res){
				                expect(res).to.exist;
				                expect(res.status).to.equal(200);
				                expect(res.body.successMessage).to.contain("You successfully logged in!!!")
				                cookie = res.headers['set-cookie'];
				                done();
			           		});
			           });
			    });
			})	
		})

		//--------------------API/V1/USER/LOGOUT------------------------//
		
		describe('------API api/v1/user/logout------',function(){
			this.timeout(20000)

			//login user after logout
			after(function (done,err) {
		        request
			            .post('http://localhost:8000/api/v1/login')
			            .send({
			                password: notYetHashed , username: tester.email
			            })
			            .end(function(err,res){
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                expect(res.body.successMessage).to.contain("You successfully logged in!!!")
			                cookie = res.headers['set-cookie'];
			                done();
			            });
			});


			it('Should only allow authorized users',function(done){
			        request
			            .get('http://localhost:8000/api/v1/user/logout')
			            .set('cookie',fakeCookie)
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(401);
			                expect(res.body.message).to.equal("You are not authorized to access this content");
			                done();		               
			            });
			    });

			it('Should log user out of the session',function(done){
				request
			            .get('http://localhost:8000/api/v1/user/logout')
			            .set('cookie',cookie)
			            .end(function(err,res){
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                expect(res.body.message).to.equal("User successfully logged out");
			                
			                //new request to check if user logged out
			                request
			            	.get('http://localhost:8000/api/v1/user')
			            	.set('cookie',cookie)
			            	.end(function(err,res){
			    				expect(err).to.exist;
				                expect(res.status).to.equal(401);
				                expect(res.body.message).to.equal("You are not authorized to access this content");
			                	done();
			            	});		               
			            });
			})

		});
	});

	//----------------------PHONE API--------------------------------//

	describe('================== mySearch Phone API ==================',function(){
		var headers;	//headers to use through the session
		var sessionCode;	
		var fakeHeaders//fake headers
		var tester;
		var notYetHashed;
		this.timeout(20000)

		//before anything happens create fake user 
		before('Create and log fake phone User in',function(done){
			this.timeout(20000)
			//create fake user with fake credentials with fake fakity fakes fakers ....
			tester = new User({	email 			: chance.email({domain: 'test.com'}),
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
	                .post('http://localhost:8000/api/v1/phone/login')
	                .send({
	                    password: notYetHashed , username: tester.username
	                })
					.type('form')
		            .end(function(err, res){
		                expect(res).to.exist;
		                expect(res.status).to.equal(200);
		                expect(res.body.authentication).to.exist
		                sessionCode = res.body.authentication;
		                headers = "username="+tester.username+"&sessionCode="+sessionCode;
		                done();
		        	})
			})
		});
		


		after(function (done,err) {
	        //Remove User and close connection with Database
	        User.findByIdAndRemove(tester._id, function (err){
	    		expect(err).to.not.exist;
	            done();
			});
		});	

		describe('------API /api/v1/phone/login------',function(){

			it('Should login user with valid email',function(done){

				request
	                .post('http://localhost:8000/api/v1/phone/login')
	                .send({
	                    password: notYetHashed , username: tester.email
	                })
					.type('form')
		            .end(function(err, res){
		                expect(res).to.exist;
		                expect(res.status).to.equal(200);
		                expect(res.body.authentication).to.exist
		                sessionCode = res.body.authentication
		                headers = "username="+tester.username+"&sessionCode="+sessionCode;
		                done();
		        	})


			})

			it('Should login user with valid username',function(done){

				request
	                .post('http://localhost:8000/api/v1/phone/login')
	                .send({
	                    password: notYetHashed , username: tester.username
	                })
					.type('form')
		            .end(function(err, res){
		                expect(res).to.exist;
		                expect(res.status).to.equal(200);
		                expect(res.body.authentication).to.exist
		                sessionCode = res.body.authentication
		                headers = "username="+tester.username+"&sessionCode="+sessionCode;
		               	done();
		        	})
			});


			it("Shouldn't login users with false username",function(done){

				request
	                .post('http://localhost:8000/api/v1/phone/login')
	                .send({
	                    password: notYetHashed , username: "NotOKUsername"
	                })
					.type('form')
		            .end(function(err, res){
		                expect(err).to.exist;
		                expect(res.status).to.equal(404);
		                expect(res.body.errorMessage).to.contain("We are sorry but we couldn't find you :(")
		                done();
		        	})
			});

			it("Shouldn't login users with false password",function(done){

				request
	                .post('http://localhost:8000/api/v1/phone/login')
	                .send({
	                    password: "You know i m no good" , username: tester.username
	                })
					.type('form')
		            .end(function(err, res){
		                expect(err).to.exist;
		                expect(res.status).to.equal(401);
		                expect(res.body.errorMessage).to.contain("Passwords don't match please try again")
		                done();
		        	})
			});
		});


		describe('------------CUSTOM SESSIONS-----------',function(){

				it("Should always check for authorization header",function(done){
			        
					request
			            .get('http://localhost:8000/api/v1/phone/user')
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(400);
			                expect(res.body.message).to.equal("You have to set authorization header");
			                done();		               
			            });
			    });

				it("Shouldn't allow headers with false username",function(done){
			        
					request
			            .get('http://localhost:8000/api/v1/phone/user')
			            .set('authorization',"username=not_right_user_blabla&sessionCode=SPAM")
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(404);
			                expect(res.body.message).to.contain("not found!!!");
			                done();		               
			            });
			    });


				it("Shouldn't allow headers with false session code" ,function(done){
			        request
			            .get('http://localhost:8000/api/v1/phone/user')
			            .set('authorization',"username="+tester.username+"&sessionCode=SPAM")
			            .end(function(err,res){
			                expect(err).to.exist;
			                expect(res.status).to.equal(401);
			                expect(res.body.message).to.equal("Passwords don't match please try again");
			                done();		               
			            });
			    });

			    it("Should let users with valid credentials access content" ,function(done){
			        request
			            .get('http://localhost:8000/api/v1/phone/user')
			            .set('authorization',headers)
			            .end(function(err,res){
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                done();		               
			            });
			    });
			

			})

		describe('------API /api/v1/phone/user------',function(){

			describe('GET REQUEST',function(){

			
				it('Should get valid user data',function(done){
			        
					request
			            .get('http://localhost:8000/api/v1/phone/user')
			            .set('authorization',headers)
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

			})

			describe('POST REQUEST',function(){

				it('Should change user data',function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: chance.email({domain : 'ch-ch-ch-changes.com'}),		
									name		: chance.first(),
									surname		: chance.last(),
									age 		: chance.age()
								}
			        request
			            .post('http://localhost:8000/api/v1/phone/user')
			            .send(toChange)
			            .set('authorization',headers)
			            .end(function(err,res){
			                //check if request ok
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                //get updated document	
			                User.findOne({_id : tester._id},function(err, updatedTester){
				                tester = updatedTester;
				                expect(toChange.email).to.equal(tester.email)
				                expect(toChange.username).to.equal(tester.username)
				                expect(toChange.name).to.equal(tester.name)
				                expect(toChange.surname).to.equal(tester.surname)
				                expect(toChange.age).to.equal(tester.age)
				                headers = "username="+toChange.username+"&sessionCode="+sessionCode;
		               			done();
			                })		               
			            });
			    });


				it('Should stop users trying to change their id',function(done){
			        request
			            .post('http://localhost:8000/api/v1/phone/user')
			            .send({	id : 'edwardSnowden_ID',
			             		_id : 'Presidents_ID'})
			            .set('authorization',headers)
			            .end(function(err,res){
			                //check if request ok
			                expect(err).to.exist;
			                expect(res.status).to.equal(400);
			                expect(res.body.errorMessage).to.equal("You can't change your id")	               
			            	done();
			            });
			    });

				it("Should not let users add data that don't exit",function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: chance.email({domain : 'ch-ch-ch-changes.com'}),		
									name		: chance.first(),
									surname		: chance.last(),
									age 		: chance.age(),
									style		: "Unique",
									title		: "Fashion-Icon",
									friends_describe_as : "god_among_humans"

								}
			        request
			            .post('http://localhost:8000/api/v1/phone/user')
			            .send(toChange)
			            .set('authorization',headers)
			            .end(function(err,res){
			                //check if request ok
			                expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                //get updated document	
			                User.findOne({_id : tester._id},function(err, updatedTester){
				                tester = updatedTester;
				                expect(toChange.email).to.equal(tester.email)
				                expect(toChange.username).to.equal(tester.username)
				                expect(toChange.name).to.equal(tester.name)
				                expect(toChange.surname).to.equal(tester.surname)
				                expect(toChange.age).to.equal(tester.age)
				                expect(tester.style).to.not.exist
				                expect(tester.title).to.not.exist
				                expect(tester.friends_describe_as).to.not.exist
				                headers = "username="+tester.username+"&sessionCode="+sessionCode;
				                done();
			                })		               
			            });
			    });

				it("Should not let users add an invalid email",function(done){
			        var toChange = {
			        				username 	: chance.first(),
									email 		: "still_dont_know_how_to_email"
								}
			        request
			            .post('http://localhost:8000/api/v1/phone/user')
			            .send(toChange)
			            .set('authorization',headers)
			            .end(function(err,res){
			                //check if request ok
		                	expect(err).to.exist;
			                expect(res.status).to.equal(400);
			                expect(res.body.errorMessage).to.equal("This is not a valid email")
			                done();
			            });
			    });

			    it("Should allow users to change their password",function(done){
			        var toChange = {
			        				password : chance.string()
								}
					//store new password			
					notYetHashed = toChange.password			
			        request
			            .post('http://localhost:8000/api/v1/phone/user')
			            .send(toChange)
			            .set('authorization',headers)
			            .end(function(err,res){
			                //check if request ok
		                	expect(res).to.exist;
			                expect(res.status).to.equal(200);
			                expect(res.body.successMessage).to.equal("Changes submited")
			                //login with new password	
			                User.findById(tester._id,function(err,user){
			            		expect(err).to.not.exist	
			            		expect(user.validPassword(notYetHashed)).to.equal(true)
			            		done();
			            	})
			           });
			    });
			})

		})
		

		describe('------API /api/v1/phone/user/logout------',function(){

			it("Should log user out of the session",function(done){

				request
			            .get('http://localhost:8000/api/v1/phone/user/logout')
			           	.set('authorization',headers)
			            .end(function(err,res){
			            	expect(res).to.exist;
			            	expect(res.status).to.equal(200)
			            	expect(res.body.successMessage).to.contain("You Logged Out Of Session") 	 
			            	request
					            .get('http://localhost:8000/api/v1/phone/user')
					           	.set('authorization',headers)
					            .end(function(err,res){
									expect(err).to.exist
									expect(res.status).to.equal(401)
									expect(res.body.message).to.equal("Please login first")
									done();
								});		    
			            })
			})


		})
	
	});
});