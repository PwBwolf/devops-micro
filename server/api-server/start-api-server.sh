#!/bin/sh

# first stop the node js server process
/etc/init.d/yip-api-server stop

# now start the node server and redirect logs to /var/log/yip-api-server.log. (devops user must own this file)
/etc/init.d/yip-api-server start
