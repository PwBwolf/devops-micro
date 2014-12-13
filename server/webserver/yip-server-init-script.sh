#!/bin/bash
#
# Service script for the Yip server running under Forever.
#
# This is suitable for Fedora, Red Hat, CentOS and similar distributions.
# It will not work on Ubuntu or other Debian-style distributions!
#
# chkconfig: 345 80 20

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
