Development and Deployment guide
----

Development:
------

* Install nginx, mongodb, nodejs (> 0.10.33), npm
* Install gulp, `sudo npm install -g gulp`
* Install all required packages: `npm install`, then `cd ../server; npm install;`, then `cd ../client; bower install`
* `cd build` and type `gulp watch` to start a livereload server, or `gulp serve` to start a non live-reload server.


Deployment:
------

* Finish the steps in development to prepare your PC to make a build
* There are four deployment environments: Production, Staging, QA, Integration
* To create a build for an environment do `gulp build <envname>` - for example, `gulp build staging` (Type `gulp` for help and syntax)
* Configure the target server if not done already:
* Ssh into the target server
* First configure nginx and set up SSL as described in config/readme.md
* Then copy the contents of dist/ to the target server. Ensure nginx can serve these files (see previous point)
* TODO Deployment of node server using forever
* TODO Update server config for db, etc.
* TODO Update server port if necessary (are we using localhost:3000 in production?)

