# This script will kill evobot process and pull the latest git.
# make sure that your files are save in the evobot folder.

echo searching PID
VARPID="$(ps aux | grep evobot | head -1 | awk '{print $2}')"

echo FOUND : $VARPID
echo KILLING $VARPID
kill $VARPID

echo PULLING evobot
git pull https://github.com/eritislami/evobot

echo UPDATING NPM
npm install
npm update

echo STARTING
nohup node $PWD/index.js &

exit 0
