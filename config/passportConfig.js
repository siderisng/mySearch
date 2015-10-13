/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)///// 
//////////File :   config/configPassport.js         /////////     
/////////////////////////////////////////////////////////////


//Load Strategy and User Model
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/models/userModel');


//Export Function so anyone can see
module.exports    = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user._id);
        });
    });

    //Strategy used for Signup
    passport.use('signup', new LocalStrategy({
        //set username and password fields
        usernameField                 : 'email',
        passwordField                 : 'password',
        passReqToCallback             : true //pass Request to callback --> true
    },
    function(req, email, password, done) {

        
        // asynchronous
        process.nextTick(function() {
            //check if request is ok
            if (!req.body.username || !email)
                return done(null, false, req.flash('signupMessage', 'You must have both an email and username'));
                    
            //find if anybody else is using this email or username
            User
                .findOne({ $or: [ { 'username': req.body.username }, { 'email': email } ] },function(err,user){
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email or username you typed in is already taken.'));
                    } else {

                        //else create user
                        var newUser     = new User();

                        //Init user's info
                        newUser.email           = email;
                        newUser.password        = newUser.generateHash(password);
                        newUser.username        = req.body.username;
                        newUser.name            = req.body.name;
                        newUser.surname         = req.body.surname;
                        newUser.age             = req.body.age;
                        newUser.onPhoneSession  = false;

                        // save user
                        newUser.save(function(err) {
                            if (err){ 
                                res.status(500).send({message : err.message})
                                return;
                            }
                            return done(null, newUser,req.flash('signupMessage', 'You Succesfully singed up with email '+email
                                + " and Username " + newUser.username));
                        });
                  
                    }

            });    

        });

    }));


    //Strategy Used for Login
    passport.use('login', new LocalStrategy({
        //Set Username And Password fields
        usernameField                 : 'username',// the input field would be username
        passwordField                 : 'password',
        passReqToCallback             : true 
    },
    function(req, username, password, done) { 
        
        //user can login with either his namespace or email so check for both
        User.findOne({$or : [{ 'email'  :  username },{'username' : username}]}, function(err, user) {
            if (err)
                return done(err);
            //If wrong username
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            //Check if password is valid
            if (!user.validPassword(password)){
                //keep ip somewhere
                //in the future allow only three tries for this ip
                var possibleThreatIp = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
                console.log("User with IP "+possibleThreatIp+" tried to access account of user " + user.username)
                return done(null, false, req.flash('loginMessage', 'Wrong password. Please try again')); // create the loginMessage and save it to session as flashdata
            }
            //if ok
            return done(null, user);
        });

    }));

};






