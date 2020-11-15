import { PnsConfig } from "./config/index.js"
import * as VM from "./vm/index.js"
import * as fs from "fs"

async function uploadGenesisFile(pnsConfig, genesisJsonStr) {
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
    const fileDir = `${datadir}/genesis.json`
    fs.writeFileSync(fileDir, genesisJsonStr)

    // Upload script using the Storage api
    const seedBucket = pnsConfig.startupScriptBucket
    const [file, apiResponse] = await seedBucket.upload(fileDir, {
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
    pnsConfig.setGenesisURL(fileURL)
}

async function start() {
    console.log(`Test setup started at: ${new Date()}`)

    // Create and Load all the common configurations
    const pnsConfig = new PnsConfig()
    await pnsConfig.init()

    // Create bucket for startup scripts
    await pnsConfig.createStartupScriptBucket()

    // Upload genesis file and set the genesisURL
    await uploadGenesisFile(pnsConfig, JSON.stringify(pnsConfig.genesis))

    // Create seeds and wait
    await VM.createSeedVMs(pnsConfig)
    // Await before the next execution
    //await new Promise((r) => setTimeout(r, 30000))

    // Create initial validators and wait
    await VM.createInitValVMs(pnsConfig)
    // Await before the next execution
    //await new Promise((r) => setTimeout(r, 30000))

    // Create validators and wait
    await VM.createValidatorVMs(pnsConfig)
    // Await before the next execution
    await new Promise((r) => setTimeout(r, 1200000))

    // Create relayers
    await VM.createRelayerVMs(pnsConfig, "relayer")
    console.log(`Test setup finished at: ${new Date()}`)
}

// Start PNS
start()
