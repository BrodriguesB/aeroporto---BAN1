# Aeroporto
Just a simple project using postgreSQL, node, and angular.
To run you need to have node installed and a database called **aeroporto**.

Clone this repo go to the root folder and call the following:
 - `npm install` to install node dependencies **YOU NEED THE LATEST VERSION OF NODE, NPM AND GIT**
 - **Change the default configurations (like the BD password and username) if necessary, those configs are in the *modes/database.js* and in *routes/index.js***
 - `node models/database.js` to set the tables models
 - I expect bower to run itself on install, but if you get dependences problems installing bower and running `bower install` should resolve.

If everything is ok you can call **`npm start`** to start the sever, and accessing http://localhost:3000 should give you a site.

## About
So, this is a university homework, the objective is to write a system to use the postgre database.
It was made in a hurry (finished in 9 days), so the code isn't too optimized and isn't very easy to understand.
It was also my first time using node as backend, express setup and using jade/pug.
I'll probably refactor everything, but i do not have much time..