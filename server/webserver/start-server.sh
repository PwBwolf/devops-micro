#!/bin/sh

# first stop the node js server process
/etc/init.d/yip-server stop

# run npm update to install any new node modules
npm update

# now start the node server and redirect logs to server.log
/etc/init.d/yip-server start
