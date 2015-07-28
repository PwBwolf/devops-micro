#!/bin/bash
#
# service yip-notification
#
# This is suitable for Fedora, Red Hat, CentOS and similar distributions.
# It will not work on Ubuntu or other Debian-style distributions!
#
# chkconfig: 345 80 20

# Source function library.
. /etc/init.d/functions

NAME=yip-notification
SOURCE_DIR=/devops/yiptv/server/notification
SOURCE_FILE=app.js

user=devops
logfile=/var/log/$NAME.log
forever=/usr/local/bin/forever

start() {
  echo "Starting $NAME node instance: "
  if [[ "$USER" == "$user" ]]
  then
        $forever start --uid $NAME -l $logfile -a -d $SOURCE_DIR/$SOURCE_FILE
  else
        daemon --user=$user $forever start --uid $NAME -l $logfile -a -d $SOURCE_DIR/$SOURCE_FILE
  fi
  RETVAL=$?
}

stop() {
  echo -n "Shutting down $NAME node instance : "
  if [[ "$USER" == "$user" ]]
  then
        $forever stop $NAME
  else
        daemon --user=$user $forever stop $NAME
  fi
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
