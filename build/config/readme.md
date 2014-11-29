Configure your machine for testing/development
-----
   * cd to the build/ directory above this directory
   * Build the front-end. Type in `gulp` to build the project. Don't forget to do `npm install` in the build directory if you haven't done it already.
   * Install nginx if you don't already have it
   * Update your hosts file: add `127.0.0.1 yiptv.com`
   * Edit the nginx conf file at `integration/nginx/sites-enabled/yiptv.com` and change the paths on lines 14, 22, 23 to match **your** machine's configuration.
   * Copy the nginx conf file at `integration/nginx/sites-enabled/yiptv.com` to `/etc/nginx/sites-enabled`
   * Reload your nginx server, `/etc/init.d/nginx reload` or `service nginx reload` depending on your flavour of Linux.
   * cd to the server directory `cd ../server` and do `node app.js` to start the Node server for the API
   * If you type in http://yiptv.com now you will be directed (after accepting the self-signed certificate) to the production version of the system.

To update a server
-----
   * Copy the appropriate nginx conf file to the /etc/nginx/sites-enabled directory and reload the server
   * Ensure you have appropriate certificates for your environment
   * The certificates in the integration/, test/, and staging/ directories are self-signed certificates and are not for development use only. Do not deploy them outside
   
