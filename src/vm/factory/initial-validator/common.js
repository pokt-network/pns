export default function(
    pocketCoreBranch,
    processScripts
) {

var processScriptsStr = processScripts.join("\n")

    return `#! /bin/bash
# Install go
wget -q -O - https://raw.githubusercontent.com/canha/golang-tools-install-script/master/goinstall.sh \
| bash -s -- --version 1.13.2

# Symlink the go binary
ln -f /.go/bin/go /usr/local/bin/go

# Create GOCACHE
export GOCACHE=/go/cache
export GOPATH=/go
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
ulimit -Sn 8192

# Spawn Pocket Core processes
${processScriptsStr}
`
}
