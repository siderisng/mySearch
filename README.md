# mySearch Stack

AUTHORS
-------
[chocof](https://github.com/chocof),
[siderisng](https://github.com/siderisng),
[gejioka](https://github.com/gejioka),
[ptzimotou](https://github.com/ptzimotou)

Description
-------
API and frontend for mySearch a new project created by MontyBits team. This project aims to build an android app to 
provide user with attractions, clubs, restaurants, theaters, etc near his location.

Starting Up
--------
1. Get The Files. 
2. Go to the mySearch-stack folder and type :
..* *sudo npm install*
..* *bower install* 
3. After You Install the dependencies run *node index.js* to start the program

###### IMPORTANT NOTE 

Make sure you've downloaded NodeJs as well as npm and bower package manager
You can find these here: 
1. [NODEJS](https://nodejs.org/),
2. [Npm](https://github.com/npm/npm)
3. [Bower](http://bower.io/)

Project Info
============

Back-end
-------

##### Security
I used Passport for the authorization of the user as well as the creation of sessions.
The file config/passportConfig.js is basically the configuration of the passport in which 
I created two strategies(signup and login). The file is based on an example i found in [scotch.io](https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together).
 Generally speaking the user has to provide us with email , username, email and password during signup and 
 (if he really wants it to :P) name, surname and age. Later he will have the chance to do this via 
 posting /api/v1/user/edit. 

If you want to use an https server just uncomment the last sections of index.js and comment out the http one.
My approach is using a proxy server(nginx) between client and server which uses https connection from client to 
proxy and http from proxy to local server. 

I've also added a script for creating your own rsa keys(for the https connection) in Notes folder



Front-end
-------
Under Development
