# mySearch & mySearch Analytics

AUTHORS
-------
[chocof](https://github.com/chocof),
[siderisng](https://github.com/siderisng),


Description
-------
mySearch is a project created by MontyBits team. This project aims to build android and iOS mobile apps to 
provide users with attractions, clubs, restaurants, theaters, etc near his location. Project shall also include 
a full Stack application where MEAN Stack is Used. 
mySearch Analytics will be created after mySearch is complete. It uses mySearch's database data to handle user requests and
make suggestions about the most "hot" places in town.
This repo is the Web application created by chocof and siderisng.

Starting Up
========

###### IMPORTANT NOTE 

SERVERS
-------

Make sure you've downloaded NodeJs as well as npm and bower package manager
You can find these here: 

1. [NODEJS](https://nodejs.org/),

2. [Npm](https://github.com/npm/npm)

3. [Bower](http://bower.io/)

1. Get The Files (clone the directory). 
2. In order to run a server move to the appropriate folder and type:
  
  sudo npm install
  
  sudo npm -g bower install(Optional. Install bower globally)
  
  bower install (When asked for angular version choose >1.4.8)

3. After You Install the dependencies run *node index.js* 
in order to start the server

You have to run all three servers.
After that you can access the websites in the following urls:


mySearch 		: localhost:8000

mySearch Analytics 	: localhost:9000

mySearch DB 		: localhost:8500

In order to run the tests you have to install mocha.
To install it press sudo npm install -g mocha (to install it globally)  
After that run every server (node index.js) open a new terminal session
in the folder you are interested in and type  : mocha.


Folders 
=========

MS_STACK
--------
Used for mySearch application. This server provides a restfull api 
for mobile apps as well as mysearch website. 

DB_SERVER(javascript,jade,css) 
--------
This servers handles requests to the database and serves them to mS_STACK
and MSA_STACK servers.

MSA_STACK(javascript,jade,css)
--------
Used for mySearch Analytics application. This server provides a restfull api 
for mysearch-analytics website. 


Mean Stack Structure
--------
MEAN STACK files are based on the following structure

1./app folder contains /api <-Applications' api's /routes<-Defines rooting
and /models<-contains mongodb models

2./config contains files used for basic configuration or useful functions that are 
commonly used

3./doc contains project documentation (accessible through the "R u a developer" 
option at all websites )

4.index.js is the basic server configuration 

5./public contains /js folder -> which contains app,controller and services files
/img -> which contains images used on site and /vid -> which contains videos used on 
site 

6./test contains basic tests. To execute run "mocha"

7./views contains jade and css files for views

8.bower.json frontend dependencies (bower install)

9.package.json backend dependencies (sudo npm install)

USE
========
mySearch
--------
To signup click on the option "Not a member yet? RLY?" and type the information
required. To login just use your email or username and your password on the input
fields and click on login.

myProfile 		: See personal info and stats

Edit myInfo 	: Edit your info

myStatistics 	: See your statistics (Graphs, piecharts, etc)

myMaps			: See the locations you've been to   


mySearch Analytics
-------------
To signup click on the option "Not a member yet? RLY?" and type the information
required. To login just use your email or username and your password on the input
fields and click on login.

Dashboard 				: Basic user information

Statistics & Analysis 	: Type or select a city. Select from the submenu "City Info" 
to see graphs, maps and statistics or the option "City Zones" to split the area into 
zones with information.  

Search for service		: Search for requests based on queries and press search. 
After that a dropdown menu with cities will appear where you can select and see info 
about city 

Edit Info 				: Edit your info

Membership  			: Update your membership (Buy more months)

Contact 				: See contact info

MODULES_USED
============

Back-End
--------
We used Mongodb(database management),Nodejs and Express in order to create
a robust and safe application. API Documentation is available @ /documentation path.

Modules Used : 
apidoc,
angular-cookies,
body-parser,
cookie-parser,
cron,
chai,
chance,
connect-flash,
consolidate,
coupon-code,
crypto,
datejs,
express,
express-session,
http,
jade,
mongodb-uri,
mongoose,
mongodb-uri,
morgan,
passport,
passport-local,
paypal-ipn,
qs,
request-promise,
should,
superagent

Front-End 
--------
We used angular for the controllers.

Modules Used : 
angular-bootstrap,
angular-resource,
angular-ui-router,
c3,
bootstrap,
font-awesome,
reveal-highlight-themes,
angular-cookies,
notie,
angular-swipe,
angular-loading,
angular,
jqcloud2,
angular-jqcloud,
angular-touch,
angular-feeds,
jquery,
allmighty-autocomplete


HEROKU LINKS
------
mySearch App 		: https://my-search.herokuapp.com

mySearch-Analytics 	: https://mysearch-analytics.herokuapp.com

mySearch DB 		: https://mysearch-hiddendb.herokuapp.com



