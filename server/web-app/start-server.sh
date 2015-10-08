#!/bin/sh

# first stop the node js server process
/etc/init.d/yip-server stop

# run npm update to install any new node modules
# npm update

# run the script to reload the fixtures to the database
cwd=`pwd`
cd ../common/database
node fixtures.js
cd $cwd

# now start the node server and redirect logs to /var/log/yip-server.log. (devops user must own this file)
/etc/init.d/yip-server start

# send email notifying new build
cd ..
node ../tools/deployment-scripts/notify-build.js
