export default function(process, genesisURL, passphrase) {

    // Set constants
    const rootDir = process.rootDir
    const account = process.account
    const moniker = process.moniker
    const configJSON = process.configJSON

    const script = `# Pocket Core Seed Process Configuration for process ${moniker}
# Create pocket datadir
mkdir ${rootDir}

# Create config dir
mkdir ${rootDir}/config

# Move to config dir
cd ${rootDir}/config

# Create genesis.json
wget --output-document genesis.json ${genesisURL}

# Create config.json
echo '${JSON.stringify(configJSON)}' > ${rootDir}/config/config.json

# Create chains.json
echo '[]' > ${rootDir}/config/chains.json

# Run pocket core via expect
expect -c '

# Import account
spawn pocket --datadir ${rootDir} accounts import-raw ${account.privateKeyHex}
sleep 1
send -- "${passphrase}\\n"
expect eof

# Set validator
spawn sh -c "pocket --datadir ${rootDir} accounts set-validator ${account.addressHex}"
sleep 1
send -- "${passphrase}\\n"
expect eof
'

# Start pocket core
pocket --datadir ${rootDir} start >> ${rootDir}/logs.txt 2>> ${rootDir}/error-logs.txt &
`

    return script
}