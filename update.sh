#!/bin/bash
# This script will kill evobot process and pull the latest git.
# make sure that your files are save in the evobot folder.

VARPID="$(ps aux | grep evobot | head -1 | awk '{print $2}')"

echo FOUND : $VARPID
kill $VARPID

git pull https://github.com/eritislami/evobot

npm install
npm update

nohup node index.js &

exit 0
