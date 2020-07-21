#Ubuntu Install Skript

echo Installing Evobot...
apt install nano git build-essential unzip software-properties-common curl -y
sudo apt-get update -y
sudo apt-get install ffmpeg libopus-dev libffi-dev libsodium-dev -y
sudo apt-get upgrade -y
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone https://github.com/eritislami/evobot.git
cd evobot
npm i
cp config.json.example config.json
clear
nano config.json
echo Done! Starting...
node shard.js
