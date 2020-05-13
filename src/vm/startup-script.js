export default function createStartupScript(genesisObj, configObj, chainsObj, seedAccount, passphrase) {
    return `#! /bin/bash
# Update the system
apt-get update

# Install dependencies
apt-get --assume-yes install expect build-essential curl file git libleveldb-dev gcc wget golang-go

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
git checkout tags/RC-0.3.1 -b v0.3.1
go build -tags cleveldb -o /usr/local/bin/pocket ./app/cmd/pocket_core/main.go

# Apply updates
source /root/.bashrc

# Create pocket datadir
mkdir /root/.pocket

# Create config dir
mkdir /root/.pocket/config

# Create genesis.json
echo '${JSON.stringify(genesisObj)}' > /root/.pocket/config/genesis.json

# Create config.json
echo '${JSON.stringify(configObj)}' > /root/.pocket/config/config.json

# Create chains.json
echo '${JSON.stringify(chainsObj)}' > /root/.pocket/config/chains.json

# Define $HOME
export HOME=/root
echo 'export HOME=/root' >> /root/.bashrc

# Switch to expect
expect << 'EOS'

# Import account
spawn pocket accounts import-raw ${seedAccount.privateKeyHex}
sleep 1
send -- "${passphrase}\\n"
expect eof

# Set validator
spawn sh -c "pocket accounts set-validator \`pocket accounts list | cut -d' ' -f2- \`"
sleep 1
send -- "${passphrase}\\n"
expect eof

# Start pocket core
spawn pocket start > /root/.pocket/logs.txt 2>&1 &
expect eof

# Finish expect script
EOS`
}
