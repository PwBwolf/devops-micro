#!/bin/sh

#################### Rule Engine start ######################
#--rule-engine#cd rule-engine
# first stop the corresponding nodejs script
#--rule-engine#forever stop rule-engine-main.js

# run npm update to install any new node modules
#--rule-engine#npm update

# now start the node server and redirect logs to server.log
#--rule-engine#forever start -al /var/log/rule-engine.log rule-engine-main.js
#--rule-engine#cd ..
#################### Rule Engine end ######################
