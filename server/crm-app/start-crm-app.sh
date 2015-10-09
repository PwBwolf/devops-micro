#!/bin/sh

# first stop the node js server process
/etc/init.d/yip-crm-app stop

# now start the node server and redirect logs to /var/log/yip-crm-app.log. (devops user must own this file)
/etc/init.d/yip-crm-app start
