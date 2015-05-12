#!/bin/sh

cwd=`pwd`
cd ../server/common/database

node cleanup.js

cd $cwd
