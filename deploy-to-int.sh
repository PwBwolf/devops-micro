#!/bin/bash

git checkout master
git pull
cd client/web-app
bower install
cd ../../build
cd build
gulp deploy --env integration --deployType patch --tag true
cd dist
git status
git add --all
git commit -m "push to int"
git push integration master -f
cd ../..
git branch
git checkout master
git branch
