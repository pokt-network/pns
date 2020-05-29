import createCommonSeedScript from "./common.js"
import createProcessSeedScript from "./process.js"
import * as fs from "fs"

// Uploads a script to cloud storage and returns it's public URL
export default async function(pnsConfig, vmMoniker, pocketCoreBranch, genesisURL, passphrase, processes) {
    // Create process scripts
    const processScripts = []
    for (let index = 0; index < processes.length; index++) {
        const process = processes[index];
        const processScript = createProcessSeedScript(process, genesisURL, passphrase)
        processScripts.push(processScript)
    }

    // Create common script
    const commonScript = createCommonSeedScript(pocketCoreBranch, processScripts)

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
    const fileDir = `${datadir}/${vmMoniker}.sh`
    fs.writeFileSync(fileDir, commonScript)

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
    return fileURL[0]
}