#!/bin/sh

/etc/init.d/yip-email-sms-processor stop
/etc/init.d/yip-subscription-processor stop
/etc/init.d/yip-cj-report-processor stop

npm update

/etc/init.d/yip-email-sms-processor start
/etc/init.d/yip-subscription-processor start
/etc/init.d/yip-cj-report-processor start

