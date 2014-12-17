#!/bin/sh

#################### Rule Engine start ######################
#--rule-engine#cd rule-engine
# first stop the corresponding nodejs script
#--rule-engine#/etc/init.d/yip-rule-engine stop

# run npm update to install any new node modules
#--rule-engine#npm update

# now start the node server and redirect logs to server.log
#--rule-engine#/etc/init.d/yip-rule-engine start
#--rule-engine#cd ..
##################### Rule Engine end #######################
