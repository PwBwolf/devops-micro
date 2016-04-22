#!/bin/sh

/etc/init.d/yip-rule-engine stop
/etc/init.d/yip-metadata-processor stop
/etc/init.d/yip-notification-processor stop
/etc/init.d/yip-cj-report-processor stop

npm update

/etc/init.d/yip-rule-engine start
/etc/init.d/yip-metadata-processor start
/etc/init.d/yip-notification-processor start
/etc/init.d/yip-cj-report-processor start

