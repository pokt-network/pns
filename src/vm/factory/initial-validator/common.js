export default function(
    pocketCoreBranch,
    processScripts,
    ulimit
) {

var processScriptsStr = processScripts.join("\n")

    return `#! /bin/bash
# Update the system
apt-get update

# Install Monitoring Stack Driver Agent
mkdir /etc/google
mkdir /etc/google/auth
wget -O /etc/google/auth/application_default_credentials.json https://storage.googleapis.com/monitoring-writer/Validator%20Load%20Test-82047bba1023.json
curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
sudo bash add-monitoring-agent-repo.sh
sudo apt-get update
sudo apt-get install -y 'stackdriver-agent=6.*'
sudo service stackdriver-agent start
sudo service stackdriver-agent status

# Install go
wget -q -O - https://raw.githubusercontent.com/canha/golang-tools-install-script/master/goinstall.sh \
| bash -s -- --version 1.13.2

# Symlink the go binary
ln -f /.go/bin/go /usr/local/bin/go

# Create GOCACHE
export GOCACHE=/go/cache
export GOPATH=/go
echo 'export GOCACHE=/go/cache' >> /root/.bashrc
echo 'export GOPATH=/go' >> /root/.bashrc
export HOME=/root
export GOROOT=/.go
echo 'export GOCACHE=/go/cache;' >> /root/.bashrc
echo 'export GOPATH=/go;' >> /root/.bashrc
echo 'export HOME=/root;' >> /root/.bashrc
echo 'export GOROOT=/.go;' >> /root/.bashrc

# Apply updates
source /root/.bashrc

# Build from source
git clone https://github.com/pokt-network/pocket-core.git /go/src/github.com/pokt-network/pocket-core
cd /go/src/github.com/pokt-network/pocket-core
git checkout ${pocketCoreBranch} -b loadtest
GO111MODULE=on go mod vendor
GO111MODULE=on go build -tags cleveldb -o /usr/local/bin/pocket ./app/cmd/pocket_core/main.go

# Increase ulimit
ulimit -Sn ${ulimit}

# Install ganache cli

# Install NodeJS dependencies
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

# Install dependencies
apt-get --assume-yes install build-essential nodejs

# Apply updates
source /root/.bashrc

# Install ganache-cli
npm install -g ganache-cli

# Run ganache and output logs
mkdir ~/.ganache
ganache-cli >> ~/.ganache/ganache-logs.txt 2>> ~/.ganache/ganache-logs-error.txt &

# Spawn Pocket Core processes
${processScriptsStr}
`
}
