#!/bin/bash
#
# Service script for a Node.js application running under Forever.
#
# This is suitable for Fedora, Red Hat, CentOS and similar distributions.
# It will not work on Ubuntu or other Debian-style distributions!
#
# There is some perhaps unnecessary complexity going on in the relationship between
# Forever and the server process. See: https://github.com/indexzero/forever
#
# 1) Forever starts its own watchdog process, and keeps its own configuration data
# in /var/run/forever.
#
# 2) If the process dies, Forever will restart it: if it fails but continues to run,
# it won't be restarted.
#
# 3) If the process is stopped via this script, the pidfile is left in place; this
# helps when issues happen with failed stop attempts.
#
# 4) Which means the check for running/not running is complex, and involves parsing
# of the Forever list output.
#
# chkconfig: 345 80 20
# description: my application description
# processname: my_application_name
# pidfile: /var/run/my_application_name.pid
# logfile: /var/log/my_application_name.log
#

# Source function library.
. /etc/init.d/functions

NAME=yip-server
SOURCE_DIR=/devops/yiptv/server/webserver
SOURCE_FILE=app.js

user=devops
logfile=/var/log/$NAME.log
forever=/usr/local/bin/forever

start() {
  echo "Starting $NAME node instance: "
  $forever start --uid $NAME -l $logfile -a -d $SOURCE_DIR/$SOURCE_FILE
  RETVAL=$?
}

stop() {
  echo -n "Shutting down $NAME node instance : "
  $forever stop $NAME
  RETVAL=$?
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  *)
    echo "Usage:  {start|stop}"
    exit 1
    ;;
esac
exit $RETVAL
