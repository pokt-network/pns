import uploadSeedStartupScript from "./seed/index.js"
import uploadInitValStartupScript from "./initial-validator/index.js"
import uploadValStartupScript from "./validator/index.js"
import uploadRelayerStartupScript from "./relayer/index.js"
import createVM from "./create-vm.js"

function createVMStartupScript(startupScriptURL) {
    return `#! /bin/bash
# Update the system
apt-get update

# Install dependencies
apt-get --assume-yes install expect build-essential curl file git libleveldb-dev gcc wget

# Download startup script and run it
cd /root
bash <(curl -s ${startupScriptURL})
`
}

export async function createSeedVM(pnsConfig, moniker, ipv4, processes) {
    // Setup params
    const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
    const genesisURL = pnsConfig.genesisURL
    const passphrase = "seedpassphrase"
    let startupScriptURL = undefined

    try {
        // Create startup script
        startupScriptURL = await uploadSeedStartupScript(
            pnsConfig,
            moniker,
            pocketCoreBranch,
            genesisURL,
            passphrase,
            processes
        )
    } catch (error) {
        console.log(error)
        return createSeedVM(pnsConfig, moniker, ipv4, processes)
    }

    // Create common startup script
    const startupScript = createVMStartupScript(startupScriptURL)

    try {
        // Create the VM
        return createVM(
            pnsConfig.pnsTemplate.dryRun,
            pnsConfig.pnsTemplate.zone,
            pnsConfig.pnsTemplate.seeds.machineType,
            pnsConfig.pnsTemplate.projectID,
            moniker,
            pnsConfig.pnsTemplate.network.name,
            ipv4,
            startupScript,
            pnsConfig.pnsTemplate.seeds.diskSizeGb
        )
    } catch (error) {
        console.log(error)
        // Create the VM
        return createVM(
            pnsConfig.pnsTemplate.dryRun,
            pnsConfig.pnsTemplate.zone,
            pnsConfig.pnsTemplate.seeds.machineType,
            pnsConfig.pnsTemplate.projectID,
            moniker,
            pnsConfig.pnsTemplate.network.name,
            ipv4,
            startupScript,
            pnsConfig.pnsTemplate.seeds.diskSizeGb
        )
    }
}

export async function createInitValVM(pnsConfig, moniker, ipv4, processes) {
    // Setup params
    const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
    const genesisURL = pnsConfig.genesisURL
    const passphrase = "initvalpassphrase"
    let startupScriptURL = undefined

    try {
        // Create startup script
        startupScriptURL = await uploadInitValStartupScript(
            pnsConfig,
            moniker,
            pocketCoreBranch,
            genesisURL,
            passphrase,
            processes
        )
    } catch (error) {
        console.log(error)
        return createInitValVM(pnsConfig, moniker, ipv4, processes)
    }

    // Create common startup script
    const startupScript = createVMStartupScript(startupScriptURL)

    try {
        // Create the VM
        return createVM(
            pnsConfig.pnsTemplate.dryRun,
            pnsConfig.pnsTemplate.zone,
            pnsConfig.pnsTemplate.initialValidators.machineType,
            pnsConfig.pnsTemplate.projectID,
            moniker,
            pnsConfig.pnsTemplate.network.name,
            ipv4,
            startupScript,
            pnsConfig.pnsTemplate.initialValidators.diskSizeGb
        )
    } catch (error) {
        console.log(error)
        // Create the VM
        return createVM(
            pnsConfig.pnsTemplate.dryRun,
            pnsConfig.pnsTemplate.zone,
            pnsConfig.pnsTemplate.initialValidators.machineType,
            pnsConfig.pnsTemplate.projectID,
            moniker,
            pnsConfig.pnsTemplate.network.name,
            ipv4,
            startupScript,
            pnsConfig.pnsTemplate.initialValidators.diskSizeGb
        )
    }
}

// export async function createValVM(pnsConfig, moniker, ipv4, processes) {
//     // Setup params
//     const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
//     const genesisURL = pnsConfig.genesisURL
//     const passphrase = "valpassphrase"

//     // Create startup script
//     const startupScriptURL = await uploadValStartupScript(
//         pnsConfig,
//         moniker,
//         pocketCoreBranch,
//         genesisURL,
//         passphrase,
//         processes
//     )

//     // Create common startup script
//     const startupScript = createVMStartupScript(startupScriptURL)

//     // Create the VM
//     return createVM(
//         pnsConfig.pnsTemplate.dryRun,
//         pnsConfig.pnsTemplate.zone,
//         pnsConfig.pnsTemplate.seeds.machineType,
//         pnsConfig.pnsTemplate.projectID,
//         moniker,
//         pnsConfig.pnsTemplate.network.name,
//         ipv4,
//         startupScript,
//         "200"
//     )
// }

export async function createRelayerVM(pnsConfig, moniker, ipv4) {
    const prltsBranch = pnsConfig.pnsTemplate.relayers.branch
    const prltsConfigObj = pnsConfig.pnsTemplate.relayers.config
    const processCount = pnsConfig.pnsTemplate.relayers.processes
    const testType = pnsConfig.pnsTemplate.relayers.testType
    const startupScriptURL = await uploadRelayerStartupScript(
        prltsBranch,
        prltsConfigObj,
        processCount,
        testType,
        pnsConfig,
        moniker
    )
    const startupScript = createVMStartupScript(startupScriptURL)
    return createVM(
        pnsConfig.pnsTemplate.dryRun,
        pnsConfig.pnsTemplate.zone,
        pnsConfig.pnsTemplate.relayers.machineType,
        pnsConfig.pnsTemplate.projectID,
        moniker,
        pnsConfig.pnsTemplate.network.name,
        ipv4,
        startupScript,
        pnsConfig.pnsTemplate.relayers.diskSizeGb
    )
}
