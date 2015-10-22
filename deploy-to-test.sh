#!/bin/bash

if [ "$1" != "" ]; then
    git checkout master
    git pull
    cd build
    gulp deploy --env test --tag $1
    cd dist
    git status
    git add --all
    git commit -m "push to test"
    git push test master -f
    cd ../..
    git branch
    git checkout master
    git branch
else
    echo "Build number is missing"
fi


