#!/bin/bash

unset VARPID
unset DIRECTORY

DIRECTORY="$(cd `dirname $0` && pwd)"
VARPID="$(ps aux | grep [e]vobot | head -1 | awk '{print $2}')"

if [ ! -n "$VARPID" ]

then
	echo "EVOBOT IS NOT RUNNING"
	echo "CHECKING UPDATES"
	cd $DIRECTORY 
		git pull https://github.com/eritislami/evobot
		npm install
		npm update
	echo "STARTING EVOBOT"
		nohup node $PWD/index.js &
	unset VARPID
	unset DIRECTORY
else
	echo "EVOBOT IS RUNNING AT PID : $VARPID"
	echo "KILLING PROCESS ID : $VARPID"
	cd $DIRECTORY
		kill $VARPID || /bin/true
	echo "CHECKING UPDATES"
		git pull https://github.com/eritislami/evobot
		npm install
		npm update
	echo "STARTING EVOBOT"
		nohup node $PWD/index.js &
	unset VARPID
	unset DIRECTORY
fi
exit 0
