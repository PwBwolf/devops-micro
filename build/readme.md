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

* There are four deployment environments: Production, Staging, QA, Integration
* To deploy to an environment create a build for it using `gulp build <envname>` - for example, `gulp build staging`

