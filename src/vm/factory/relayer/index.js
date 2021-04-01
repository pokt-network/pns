import * as fs from "fs"

function createRelayerStartupScript(prltsBranch, prltsConfigObj, processCount, testType) {
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
apt-get --assume-yes install build-essential nodejs zip

# Apply updates
source /root/.bashrc

# Install forever
npm install -g forever

# Apply updates
source /root/.bashrc

# Create configuration directory
mkdir /root/prlts_config
echo '${JSON.stringify(prltsConfigObj)}' > /root/prlts_config/config.json
sudo chmod -R 777 /root/prlts_config

# Create empty datadir
mkdir ${prltsConfigObj.data_dir}
sudo chmod -R 777 ${prltsConfigObj.data_dir}

# Clone pocket core and build it
git clone https://github.com/pokt-network/pocket-js.git /root/pocket-js
cd /root/pocket-js
npm install
npm run build

# Build from source
git clone https://github.com/pokt-network/prlts.git /root/prlts
cd /root/prlts
git checkout ${prltsBranch} -b loadtest
npm install

# Create .env file
echo 'PRLTS_CONFIG_FILE=/root/prlts_config/config.json' > /root/prlts/.env

# Run PRLTS script N times according to processCount=${processCount}
${foreverStarts}

# Move back to the root directory
cd /root

# Install Default Service Account
mkdir /etc/google
mkdir /etc/google/auth
wget -O /etc/google/auth/application_default_credentials.json https://storage.googleapis.com/default-service-account/validator-load-test-67c13625bc16.json

# Install GCloud
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-328.0.0-linux-x86_64.tar.gz
tar -xvf google-cloud-sdk-328.0.0-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh -q

# Add snap/bin to path
export PATH="$PATH:/snap/bin"

# Init gcloud
gcloud auth activate-service-account --key-file=/etc/google/auth/application_default_credentials.json`
}

export default async function (prltsBranch, prltsConfigObj, processCount, testType, pnsConfig, moniker) {
    const startupScript = createRelayerStartupScript(prltsBranch, prltsConfigObj, processCount, testType)
    // Save it to file
    const workDir = process.cwd()
    // Create data dir if not exists
    const datadir = `${workDir}/data/${pnsConfig.storageBucket}`
    // Create the data directory for this instance if not exists
    if (!fs.existsSync(datadir)) {
        fs.mkdirSync(datadir, {
            recursive: true
        })
    }
    // Save script to file
    const fileDir = `${datadir}/${moniker}.sh`
    fs.writeFileSync(fileDir, startupScript)

    // Upload script using the Storage api
    const startupScriptBucket = pnsConfig.startupScriptBucket
    const [file, apiResponse] = await startupScriptBucket.upload(fileDir, {
        public: true,
        userProject: pnsConfig.pnsTemplate.projectID,
        validation: "crc32c",
    })
    // URL config
    const config = {
        action: "read",
        expires: "03-17-2025",
    }
    const fileURL = await file.getSignedUrl(config)
    return fileURL[0]
}
