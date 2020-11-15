export default function (prltsBranch, prltsConfigObj, processCount, testType) {
    if (processCount <= 0) {
        throw new Error("Invalid process count: " + processCount)
    }

    var foreverStarts = ""
    for (let index = 0; index < processCount; index++) {
        foreverStarts = foreverStarts.concat(
            `NODE_OPTIONS=--max_old_space_size=2048 forever start src/index.js ${testType}\n`
        )
    }

    return `#! /bin/bash
# Define $HOME
export HOME=/root
echo 'export HOME=/root' >> /root/.bashrc

# Apply updates
source /root/.bashrc

# Update the system
apt-get update

# Install NodeJS dependencies
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

# Install dependencies
apt-get --assume-yes install build-essential nodejs

# Apply updates
source /root/.bashrc

# Install forever
npm install -g forever

# Apply updates
source /root/.bashrc

# Create configuration directory
mkdir /root/prlts_config
#echo '${JSON.stringify(prltsConfigObj)}' > /root/prlts_config/config.json
echo '{"chains":[{"hash":"0011","application_private_keys":[],"payloads":[{"data":{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xF02c1c8e6114b1Dbe8937a39260b5b0a374432bB","latest"],"id":1},"blockchain":"0011","consensus_enabled":false},{"data":{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",true],"id":1},"blockchain":"0011","consensus_enabled":false},{"data":{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1},"blockchain":"0011","consensus_enabled":false},{"data":{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1},"blockchain":"0011","consensus_enabled":false}]}],"session_block_frequency":4,"block_time":30000,"relay_timeout":2000,"parallel_relays":10,"dispatchers":["http://10.128.0.35:8081"],"data_dir":"/root/prlts_data","log_level":"debug","logs_to_console":false}' > /root/prlts_config/config.json
sudo chmod -R 777 /root/prlts_config

# Create empty datadir
mkdir /root/prlts_data
sudo chmod -R 777 /root/prlts_data

# Clone pocket core and build it
git clone https://github.com/pokt-network/pocket-js.git /root/pocket-js
cd /root/pocket-js
npm install
npm run build

# Build from source
git clone https://github.com/pokt-network/prlts.git /root/prlts
cd /root/prlts
git checkout staging -b loadtest
npm install

# Create .env file
echo 'PRLTS_CONFIG_FILE=/root/prlts_config/config.json' > /root/prlts/.env

# Run PRLTS script N times according to processCount=${processCount}
${foreverStarts}`
}
