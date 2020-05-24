export default function(
    pocketCoreBranch,
    genesisURL,
    configObj,
    chainsObj,
    valAccount,
    passphrase,
    ipv4,
    blockTime
) {

const chainsJSON = chainsObj.map(function(chainID) {
    return {
        id: chainID,
        url: "http://localhost:8545"
    }
})

    return `#! /bin/bash
# Update the system
apt-get update

# Install dependencies
apt-get --assume-yes install expect build-essential curl file git libleveldb-dev gcc wget golang-go

# Install Ganache
sudo npm install -g ganache-cli

# Start ganache
ganache-cli > /root/ganache-logs.txt 2>&1 &

# Install go
wget -q -O - https://raw.githubusercontent.com/canha/golang-tools-install-script/master/goinstall.sh \
| bash -s -- --version 1.13.2

# Create GOCACHE
export GOCACHE=/go/cache
export GOPATH=/go
echo 'export GOCACHE=/go/cache' >> /root/.bashrc
echo 'export GOPATH=/go' >> /root/.bashrc

# Apply updates
source /root/.bashrc

# Build from source
git clone https://github.com/pokt-network/pocket-core.git /go/src/github.com/pokt-network/pocket-core
cd /go/src/github.com/pokt-network/pocket-core
git checkout ${pocketCoreBranch} -b loadtest
go build -tags cleveldb -o /usr/local/bin/pocket ./app/cmd/pocket_core/main.go

# Apply updates
source /root/.bashrc

# Create pocket datadir
mkdir /root/.pocket

# Create config dir
mkdir /root/.pocket/config

# Move to config dir
cd /root/.pocket/config

# Create genesis.json
wget ${genesisURL}

# Create config.json
echo '${JSON.stringify(configObj)}' > /root/.pocket/config/config.json

# Create chains.json
echo '${JSON.stringify(chainsJSON)}' > /root/.pocket/config/chains.json

# Define $HOME
export HOME=/root
echo 'export HOME=/root' >> /root/.bashrc

# Run pocket core via expect
expect -c '

# Import account
spawn pocket accounts import-raw ${valAccount.privateKeyHex}
sleep 1
send -- "${passphrase}\\n"
expect eof

# Set validator
spawn sh -c "pocket accounts set-validator \`pocket accounts list | cut -d\\" \\" -f2- \`"
sleep 1
send -- "${passphrase}\\n"
expect eof
'

# Start pocket core
pocket start --blockTime ${blockTime} >> /root/.pocket/logs.txt 2>> /root/.pocket/error-logs.txt &

# Stake the node in the network via itself
expect -c '

# Sleep before sending the stake transaction
sleep 60

# Send stake operation
spawn pocket nodes stake ${valAccount.addressHex} 100000000 0001 http://${ipv4}:8081 loadnet
sleep 5
send -- "${passphrase}\\n"
expect eof
' > /root/.pocket/stake-result.txt 2>&1
`
}
