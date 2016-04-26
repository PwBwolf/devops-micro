#!/bin/sh

/etc/init.d/yip-api-server stop
/etc/init.d/yip-web-app stop

npm update

cwd=`pwd`
cd common/database
node fixtures.js
cd $cwd

/etc/init.d/yip-api-server start
/etc/init.d/yip-web-app start

cd ..
node tools/deployment-scripts/notify-build.js
