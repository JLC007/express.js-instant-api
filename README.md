# Express.js Instant Api Generator
A node.js application to generate standard CRUD operations for every table in a postgresql database

## Purpose
The purpose of the program is to create CRUD operations for every table in the database as well as the corresponding routing and endpoints for every action.
This will prevent any PEAN (Postgresql, express.js, angular.js and node.js) developer from excessive copy-and-pasting.

The added benefit is a ready to use admin interface to manipulate data while testing

## Getting Started
Run ```npm init```
and then 
```npm install```

This requires [pg-structure](https://www.npmjs.com/package/pg-structure) npm package to read the postgresql database schema. This is included in the package.json file.

## Config Settings
There is an init file where all the database and other configurations are stored. These need to be configured before running the application.

Important settings:

* Host
* Database
* Username
* Password
* Port
* Output folder for the generated database and route files
* Database file name
* Routing file name (containing the endpoints)

## Usage
Once these files have been generated you can create a new project and copy these files across.
In the new project you will require the following npm packages

[Bluebird](https://www.npmjs.com/package/bluebird)
[Express](https://www.npmjs.com/package/express)

Also you just need to create the app.js or index.js file.

Once all of this is in place.

npm start app.js
