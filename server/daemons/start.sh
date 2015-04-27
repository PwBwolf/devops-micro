#!/bin/sh

#################### Rule Engine start ######################
#--rule-engine#cd rule-engine
# first stop the corresponding nodejs script
#--rule-engine#/etc/init.d/yip-rule-engine stop

# run npm update to install any new node modules
#--rule-engine#npm update

# now start the node server and redirect logs to yip-rule-engine.log
#--rule-engine#/etc/init.d/yip-rule-engine start
#--rule-engine#cd ..
##################### Rule Engine end #######################

#################### Merchant Processor start ######################
#--merchant-processor#cd merchant-processor
# first stop the corresponding nodejs script
#--merchant-processor#/etc/init.d/yip-merchant-processor stop

# run npm update to install any new node modules
#--merchant-processor#npm update

# now start the node server and redirect logs to yip-rule-engine.log
#--merchant-processor#/etc/init.d/yip-merchant-processor start
#--merchant-processor#cd ..
##################### Merchant Processor end #######################
