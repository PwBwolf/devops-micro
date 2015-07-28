#!/bin/sh

# first stop the node js server process
/etc/init.d/yip-notification stop

# now start the node server and redirect logs to /var/log/yip-notification.log. (devops user must own this file)
/etc/init.d/yip-notification start
