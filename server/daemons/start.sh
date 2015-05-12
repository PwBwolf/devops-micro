#!/bin/sh

#################### Rule Engine start ######################
cd rule-engine
# first stop the corresponding nodejs script
/etc/init.d/yip-rule-engine stop

# run npm update to install any new node modules
npm update

# now start the node server and redirect logs to yip-rule-engine.log
/etc/init.d/yip-rule-engine start
cd ..
##################### Rule Engine end #######################

#################### Merchant Processor start ######################
cd merchant-processor
# first stop the corresponding nodejs script
/etc/init.d/yip-merchant-processor stop

# run npm update to install any new node modules
npm update

# now start the node server and redirect logs to yip-rule-engine.log
/etc/init.d/yip-merchant-processor start
cd ..
##################### Merchant Processor end #######################
