#!/bin/sh

#################### Rule Engine Start ######################
cd rule-engine
# first stop the corresponding nodejs script
/etc/init.d/yip-rule-engine stop
# run npm update to install any new node modules
npm update
# now start the node server and redirect logs to yip-rule-engine.log
/etc/init.d/yip-rule-engine start
cd ..
##################### Rule Engine End #######################

#################### Merchant Processor Start ######################
cd merchant-processor
# first stop the corresponding nodejs script
/etc/init.d/yip-merchant-processor stop
# run npm update to install any new node modules
npm update
# now start the node server and redirect logs to yip-merchant-processor.log
/etc/init.d/yip-merchant-processor start
cd ..
##################### Merchant Processor End #######################

#################### Notification Processor Start ######################
cd  notification-processor
# first stop the corresponding nodejs script
/etc/init.d/yip-notification-processor stop
# run npm update to install any new node modules
npm update
# now start the node server and redirect logs to yip-notification-processor.log
/etc/init.d/yip-notification-processor start
cd ..
##################### Notification Processor End #######################

#################### Notification Processor Start ######################
cd  metadata-processor
# first stop the corresponding nodejs script
/etc/init.d/yip-metadata-processor stop
# run npm update to install any new node modules
npm update
# now start the node server and redirect logs to yip-metadata-processor.log
/etc/init.d/yip-metadata-processor start
cd ..
##################### Notification Processor End #######################
