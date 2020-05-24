import createValidatorStartupScript from "./val-startup-script.js"
import createInitialValidatorStartupScript from "./init-val-startup-script.js"
import createSeedStartupScript from "./seed-startup-script.js"
import createRelayerStartupScript from "./relayer-startup-script.js"
import createVM from "./create-vm.js"

export async function createSeedVM(
    pnsConfig,
    moniker,
    ipv4,
    seedAccount,
    configObj
) {
    // Setup params
    const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
    const genesis = pnsConfig.genesis
    const passphrase = "seedpassphrase"
    const blockTime = pnsConfig.pnsTemplate.pocketCore.blockTime

    const startupScript = createSeedStartupScript(
        pocketCoreBranch,
        genesis,
        configObj,
        seedAccount,
        passphrase,
        blockTime
    )
    return createVM(
        pnsConfig.pnsTemplate.dryRun,
        pnsConfig.pnsTemplate.zone,
        pnsConfig.pnsTemplate.seeds.machineType,
        pnsConfig.pnsTemplate.projectID,
        moniker,
        pnsConfig.pnsTemplate.network.name,
        ipv4,
        startupScript
    )
}

export async function createInitValVM(
    pnsConfig,
    moniker,
    ipv4,
    initValAccount,
    configObj
) {
    // Setup params
    const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
    const genesis = pnsConfig.genesis
    const passphrase = "initvalpassphrase"
    const chains = pnsConfig.pnsTemplate.initialValidators.chains
    const blockTime = pnsConfig.pnsTemplate.pocketCore.blockTime

    const startupScript = createInitialValidatorStartupScript(
        pocketCoreBranch,
        genesis,
        configObj,
        chains,
        initValAccount,
        passphrase,
        blockTime
    )
    return createVM(
        pnsConfig.pnsTemplate.dryRun,
        pnsConfig.pnsTemplate.zone,
        pnsConfig.pnsTemplate.seeds.machineType,
        pnsConfig.pnsTemplate.projectID,
        moniker,
        pnsConfig.pnsTemplate.network.name,
        ipv4,
        startupScript
    )
}

export async function createValVM(
    pnsConfig,
    moniker,
    ipv4,
    valAccount,
    configObj
) {
    // Setup params
    const pocketCoreBranch = pnsConfig.pnsTemplate.pocketCore.branch
    const genesis = pnsConfig.genesis
    const passphrase = "valpassphrase"
    const chains = pnsConfig.pnsTemplate.initialValidators.chains
    const blockTime = pnsConfig.pnsTemplate.pocketCore.blockTime

    const startupScript = createValidatorStartupScript(
        pocketCoreBranch,
        genesis,
        configObj,
        chains,
        valAccount,
        passphrase,
        ipv4,
        blockTime
    )
    console.log(startupScript)
    return createVM(
        pnsConfig.pnsTemplate.dryRun,
        pnsConfig.pnsTemplate.zone,
        pnsConfig.pnsTemplate.seeds.machineType,
        pnsConfig.pnsTemplate.projectID,
        moniker,
        pnsConfig.pnsTemplate.network.name,
        ipv4,
        startupScript
    )
}

export async function createRelayerVM(
    pnsConfig,
    moniker,
    ipv4
) {
    const prltsBranch = pnsConfig.pnsTemplate.relayers.branch
    const prltsConfigObj = pnsConfig.pnsTemplate.relayers.config
    const processCount = pnsConfig.pnsTemplate.relayers.processes
    const testType = pnsConfig.pnsTemplate.relayers.testType

    const startupScript = createRelayerStartupScript(
        prltsBranch,
        prltsConfigObj,
        processCount,
        testType
    )
    return createVM(
        pnsConfig.pnsTemplate.dryRun,
        pnsConfig.pnsTemplate.zone,
        pnsConfig.pnsTemplate.seeds.machineType,
        pnsConfig.pnsTemplate.projectID,
        moniker,
        pnsConfig.pnsTemplate.network.name,
        ipv4,
        startupScript
    )
}