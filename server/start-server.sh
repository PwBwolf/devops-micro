#!/bin/sh

# first stop all node js processes running
forever stopall

# run npm update to install any new node modules
npm update

# now start the node server and redirect logs to server.log
forever start -al /var/log/server.log app.js
