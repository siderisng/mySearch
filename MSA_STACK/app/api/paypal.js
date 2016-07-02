/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :  app/api/msaUserApi.js             /////////
/////////////////////////////////////////////////////////////
 require('datejs') 
var ipn = require('paypal-ipn');
var User = require('../models/msaUser');        					///MSA User's Model
//for making http requests to google API's
var rp = require('request-promise');
var activeRequests=[];

module.exports = function(app) {

	app.route('api/v1/paypal/verify')

	//Don't forget to set paypal to send here IPN
	.post(function(req,res,next){
		res.send(200);
		ipn.verify(params, function(err, msg) {
			if (err) {
			  console.error(err);
			  return;
			}
			params = req.body
			console.log("A new payment transaction was made by user " + params.payer_email + " with status :"+params.payment_status+". The request was  "+msg);
          	res.end();
        	if (params.payment_status == 'Completed') 
       			User.findOne({email : params.payer_email},function(err,user){
       				if (err){
       					console.log("Something went wrong during paypal transaction")
       					return;
       				}

       				if (!user){
       					console.log("Someone is giving us money");
						return;
					}

					//if user is not valid add months to now
					if (!user.isValid){
						user.expDate = new Date();
					}	

					var cost_months = {
						"3" : "1",
						"7" : "3",
						"12": "9",
						"20": "12"
					}

					user.expDay = user.expDay.add(cost_months[params.mc_gross]).month;

       			})
        })
	});
			
	function addMonths(currentDate, n){
		var year = parseInt(currentDate.getFullYear());
		var month = parseInt(currentDate.getMonth());
		var date = parseInt(currentDate.getDate());
		var hour = parseInt(currentDate.getHours());
		
		newDate = new Date(year, month + n, date, hour);
	  
	 	return newDate;            
	}


}


