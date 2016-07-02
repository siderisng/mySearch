/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File :   config/session.js               /////////
/////////////////////////////////////////////////////////////

/**
	Contains sessions secrets and stuff.
*/
module.exports = {
	//used by express-session and password
	secret 		: "mySecret", 	///Sessions secret 
	name		: "MySession"	///Sessions Name
}