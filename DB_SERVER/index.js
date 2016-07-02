/////////////////////////////////////////////////////////////
//////////AUTHORS :   chocof (https://github.com/chocof)/////
//////////File    :  index.js                       /////////
/////////////////////////////////////////////////////////////

///MACROS///
var TIMEOUT_MS = 30000;

// Load Tools----------
var express  = require('express');
var app = express();
var port     = process.env.PORT || 8500;


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//documentation folder
app.use(express.static(__dirname +'/doc'));

//options for database
var db_options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: TIMEOUT_MS } },
        replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : TIMEOUT_MS } } 
    };


//load my tools
var tools = require('./config/tools.js')


//DATABASE STUFF
// I used my mongolab account to host a database you can create your own in mongolab.com(hooray for this)

//the bellow file contains username and password and it's not going to be uploaded...yet
//the general form is 
//'mongodb://<DBuserName>:<DBpassword>@ds<DB_ID>.mongolab.com:<DB_ID>/mysearchdb'
var privateData = require('./config/privateData.js')


//Config Database Stuff
var uriUtil = require('mongodb-uri');
var mongoose = require('mongoose');
var mongodbUri = privateData.url;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, db_options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:')); //check errors


////This will be executed every 24 hours

//start interval to update ranks
var CronJob = require('cron').CronJob;

var job = new CronJob('* * 24 * * *', /*now set to 24 secs*/
  tools.splitToZones,
  //When Process ends 
  function(){
    console.log("---------CRON JOB STAHP!!!---------");
  },
  true, /* Start the job right now */
  'Europe/Athens' /* Time zone of this job. */
);

job.start();


var job2 = new CronJob('* 24 * * * *', /*now set to 24 secs*/
  tools.findMostCommon,
  //When Process ends 
  function(){
    console.log("---------CRON JOB STAHP!!!---------");
  },
  true, /* Start the job right now */
  'Europe/Athens' /* Time zone of this job. */
);

job2.start();







//--------------------HTTP CONNECTION--------------------//

//start server
conn.once('open', function() {

    //create https server
    app.listen(port);
    
    require('./app/api/dbAPI.js')(app,tools);

    console.log('mySearch DB Server is On');
})


