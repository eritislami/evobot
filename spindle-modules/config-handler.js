const fs = require('fs')

const defaultTokens = {configVersion:1,discord:process.env.SHIPMOD_TOKEN,database:process.env.POSGRES_URL}
const defaultConfig = {configVersion:1,commandChar:process.env.PREFIX,maxLinkedChannels:2}

//maybe at some point make this async? not sure if its worth the time investment given that the code only runs at startup

function fetchConfig(){
  let path = './config/config.json';
  if(!fs.existsSync('./config')){
    fs.mkdirSync('./config')
  }

  if(fs.existsSync(path)){
    console.log('config file found');
    let config = fs.readFileSync(path,'utf8');
    try {
            return JSON.parse(config);
        } catch (err) {
            console.log('*************************************************************\n***** invalid json in config file, using default config *****\n*************************************************************')
            return defaultConfig;
        }
  } else {
    console.log('config file not found, generating new config file')
    let data = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(path,data)
    let config = fs.readFileSync(path,'utf8');
    return defaultConfig;
  }
}

function fetchTokens(){
  let path = './config/tokens.json'
  if(fs.existsSync(path)){
    console.log('tokens file found')
    let tokens = fs.readFileSync(path,'utf8')
    try {
            return JSON.parse(tokens);
        } catch (err) {
            console.log('*************************************************************\n***** invalid json in tokens file, using default config *****\n*************************************************************')
            return defaultTokens;
        }
  } else {
    console.log('tokens file not found, generating new tokens file')
    let data = JSON.stringify(defaultTokens, null, 2);
    fs.writeFileSync(path,data)
    let tokens = fs.readFileSync(path,'utf8')
    return JSON.parse(tokens)
  }
}

exports.fetchConfig = fetchConfig
exports.defaultConfig = defaultConfig
exports.fetchTokens = fetchTokens
exports.defaultTokens = defaultTokens
