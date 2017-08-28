# Flowz DBETL

A starter node js, jade and feathers application which provides master data creation based on schema with custom validation, custom template and can merge one schema with another.Multiple database selection (mongo,rethink,elastic etc) is available also .User can configure its own database. All CRUD operation can be done based on rest API. It also provides custom APIs where user can filter data by field names or field types.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.

## Optional

* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads)

* RethinkDB - [Download & Install RethinkDB](https://rethinkdb.com/docs/install/)

### Cloning The GitHub Repository
The recommended way to get application is to use git to directly clone the Flowz-DBETL repository:

```bash
$ git clone https://github.com/FlowzPlatform/DBETL.git
```

This will clone the latest version of the Flowz-DBETL  repository to the local folder.

### Downloading The Repository Zip File
Another way to use the Flowz-DBETL boilerplate is to download a zip copy from the [master branch on GitHub](https://github.com/FlowzPlatform/DBETL.zip). You can also do this using the `wget` command:

```bash
$ wget https://github.com/FlowzPlatform/DBETL.zip -O DBETL.zip; unzip DBETL.zip; rm DBETL.zip
```

### Running Your Application

	First go to service folder. Run below command
	
	$ npm install
	$ npm start
	
	Your api should run on port 3030 with the development environment configuration

	Now go to client folder. Run below command

	$ npm install
	
	for windows
	$ npm run start:windows
	
	for Linux/ubantu
	$ npm run start:linux

	Your application should run on port 3000 with the development environment configuration, so in your browser navigate to http://localhost:3000

	That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.

	Notes :
		Login Options
		1) static credential
			username : admin@admin.com
		        Password : admin
		2) Through google authentication

### Set your data base
	
	You can set your db after login. Also you can change your default database anytime from settings. Currently it support below databases
	1. Rethinkdb
	2. Mongodb
	3. Elasticdb

### Custom API

	GET : 
		1. Get all schema
			http://localhost:3030/schema
		2. Get schema by id
			http://localhost:3030/schema/:id
		3. Get schme by title or name
			http://localhost:3030/schema?name=......
		4. Get perticular schema entities based on types
			http://localhost:3030/schema/:id?type=.....
			types = [text , email, boolean, array, phone, number, date]
		5. Get perticular schema entities based on fieldname
			http://localhost:3030/schema/:id?fieldname=....
		6. get all instance 
			http://localhost:3030/instance
		7. Get instance by id
			http://localhost:3030/instance/:id
	POST :
		1. post schema
			http://localhost:3030/schema
		2. post instance
			http://localhost:3030/instance

	PUT :
		1. put schema
			http://localhost:3030/schema/:id

		2. put instance
			http://localhost:3030/instance/:id

	DELETE :
		1. delete schema
			http://localhost:3030/schema/:id
		2. delete instance
			http://localhost:3030/instance/:id
	
### License
Under the MIT license. See LICENSE file for more details.



	




