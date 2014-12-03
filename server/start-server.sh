#!/bin/sh

# first stop all node js processes running
forever stopall

# run npm update to install any new node modules
npm update

# now start the node server
forever start app.js
