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

	
	//before anything happens create fake user 
	before('Create and log fake User in',function(done){
		//create fake user with fake credentials with fake fakity fakes fakers ....
		tester = new User({	email 		: chance.email({domain: 'test.com'}),
								password 	: chance.string(),
								username	: chance.first() 
								})
		
		//store unhashed password
		notYetHashed = tester.password;

		//now hash and store new password
		tester.password = tester.generateHash(notYetHashed);

		//save tester
		tester.save(function(err){
			if (err){
				console.log("✗ Couldn't Save User due to error : " + err);
			}else{
				console.log("✓ Succesfully Saved Fake User ");
				//see if password is valid
				if (!(tester.validPassword(notYetHashed))){
	                console.log('✗ Invalid Password Encryption')
	            }else{
		            //now login user
		            request
		                .post('http://localhost:8000/api/v1/login')
		                .send({
		                    password: notYetHashed , username: tester.username
		                })
		                .end(function(err,res){
		                    if(err){
		                        console.log('✗ Couldn\'t log user in session');
		                    
		                    }else{
		                    	cookie = res.headers['set-cookie'];
		                    	console.log('✓ Logged Fake User In');
		                    }
		                	done();
		                });
        		}
        	}
        })
	});
	


	after(function (done,err) {
        //Remove User and close connection with Database
        User.remove({_id:tester._id}).exec(function(){
            if(err){
                console.log('✗ Couldn\'t remove user from database due to error : '+err);
            }
            else{
	            console.log('✓ Removed fake user from Database \n');
	            
	            db.connection.close(function () {
	                if(err){
	                    console.log('✗ Database : Still Open Due To error : '+err);
	                }else{
		                console.log('✓ Database: Closed');
		           	}
		    		done();
		    	});
		    }		
        });

    });



	describe('API api/v1/login',function(){
		it('Should block non-registered users',function(done){
	        request
	            .post('http://localhost:8000/api/v1/login')
	            .send({
	                password: 'wrong_password' , email: 'wrong@email'
	            })
	            .end(function(err,res){
	                if (err && err.status === 400 || err.status === 401) {
	                    res.text.should.containEql('Error: No user found with these credentials');
	                    console.log('✓ Invalid User Was Blocked');
					}
	                else if (err) {
	                    console.log('✗ An Error Happened : ' + err)
	                }else{
	                	console.log('✗ Invalid User Logged In ')	
	                }
	                done();
	            });
	    });

		it('Shall be extra cool',function(done){
			console.log("Yeah Bitches that be true")
			done();
		})

	});
});