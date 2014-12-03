#!/bin/sh
forever stopall
npm update
forever start app.js
