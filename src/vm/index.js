import { chunk } from "../util/index.js"
import * as VMFactory from "./factory/index.js"

async function createPocketCoreVMs(
    pnsConfig,
    ips,
    ipToAccountsMap,
    seedMode,
    monikerPrefix,
    maxInboundPeers,
    maxOutboundPeers,
    tendermintRpcMaxConns,
    createVMFunc
) {
    const ipsChunks = chunk(ips, 50)
    for (let chunkIndex = 0; chunkIndex < ipsChunks.length; chunkIndex++) {
        const ipsChunk = ipsChunks[chunkIndex]
        const operations = []
        for (let index = 0; index < ipsChunk.length; index++) {
            console.log(`Creating VM with prefix: ${monikerPrefix} Chunk Index ${chunkIndex} and Index ${index}`)
            // Get IP
            const ip = ipsChunk[index]
            // Get accounts from map
            const accounts = ipToAccountsMap[ip]
            // Set initial ports
            let tendermintProxyAppPort = 26658
            let tendermintRpcPort = 26657
            let tendermintP2PPort = 26656
            let pocketRpcPort = 8081
            // Set port increments
            const tendermintPortIncrement = 1000
            const pocketPortIncrement = 1
            // Set the VM moniker
            const vmMoniker = `${monikerPrefix}-${chunkIndex}-${index}`
            console.log(`Creating instance ${vmMoniker}`)

            // Process objects
            const processes = []
            for (let accountIdx = 0; accountIdx < accounts.length; accountIdx++) {
                // Get the account for the process
                const account = accounts[accountIdx]
                // Create the moniker for the Pocket Core Process
                const processMoniker = `${vmMoniker}-${accountIdx}`
                // Process root dir
                const processRootDir = `/root/.pocket-${accountIdx}`
                // Create the config.json for the process
                const configJSON = pnsConfig.createConfig(
                    processMoniker,
                    seedMode,
                    ip,
                    maxInboundPeers,
                    maxOutboundPeers,
                    `${tendermintP2PPort}`,
                    `${tendermintProxyAppPort}`,
                    `${tendermintRpcPort}`,
                    `${pocketRpcPort}`,
                    `${processRootDir}`,
                    tendermintRpcMaxConns
                )
                // Push the process obj to the array
                processes.push({
                    account: account,
                    moniker: processMoniker,
                    rootDir: processRootDir,
                    configJSON: configJSON,
                    ip: ip,
                })
                // Increment the ports
                tendermintProxyAppPort = tendermintProxyAppPort + tendermintPortIncrement
                tendermintRpcPort = tendermintRpcPort + tendermintPortIncrement
                tendermintP2PPort = tendermintP2PPort + tendermintPortIncrement
                pocketRpcPort = pocketRpcPort + pocketPortIncrement
            }

            try {
                const operation = createVMFunc(pnsConfig, vmMoniker, ip, processes)
                operations.push(operation)
            } catch (error) {
                console.error(`Error creating ${vmMoniker}`)
                console.error(error)
            }
        }

        // Await chunk of operations  to complete
        const operationResults = await Promise.all(operations)
        console.log(operationResults)
        //await new Promise((r) => setTimeout(r, 10000))
    }
}

export async function createSeedVMs(pnsConfig) {
    const seedIps = pnsConfig.seedIps
    const seedAccounts = pnsConfig.seedAccounts
    await createPocketCoreVMs(
        pnsConfig,
        seedIps,
        seedAccounts,
        true,
        "seed",
        pnsConfig.pnsTemplate.seeds.inboundPeers,
        pnsConfig.pnsTemplate.seeds.outboundPeers,
        pnsConfig.pnsTemplate.seeds.tendermintMaxConns,
        VMFactory.createSeedVM
    )
    console.log("Seed Nodes Created")
}

export async function createInitValVMs(pnsConfig) {
    const initValIps = pnsConfig.initialValIps
    const initValAccounts = pnsConfig.initialValidatorAccounts
    await createPocketCoreVMs(
        pnsConfig,
        initValIps,
        initValAccounts,
        false,
        "init-val",
        pnsConfig.pnsTemplate.initialValidators.inboundPeers,
        pnsConfig.pnsTemplate.initialValidators.outboundPeers,
        pnsConfig.pnsTemplate.initialValidators.tendermintMaxConns,
        VMFactory.createInitValVM
    )
    console.log("Initial Validator Nodes Created")
}

// export async function createValidatorVMs(pnsConfig) {
//     const valIps = pnsConfig.validatorIps
//     const valAccounts = pnsConfig.validatorAccounts
//     await createPocketCoreVMs(pnsConfig, valIps, valAccounts, false, "val", 40, 10, 136, VMFactory.createValVM)
//     console.log("Dynamic Validator Nodes Created")
// }

export async function createRelayerVMs(pnsConfig, monikerPrefix) {
    const ips = pnsConfig.relayerIps
    const ipsChunks = chunk(ips, 50)
    let totalOperationResults = []
    for (let chunkIndex = 0; chunkIndex < ipsChunks.length; chunkIndex++) {
        const ipsChunk = ipsChunks[chunkIndex]
        const operations = []
        for (let index = 0; index < ipsChunk.length; index++) {
            console.log(`Creating VM with prefix: ${monikerPrefix} Chunk Index ${chunkIndex} and Index ${index}`)
            // Get IP
            const ip = ipsChunk[index]
            // Set the VM moniker
            const vmMoniker = `${monikerPrefix}-${chunkIndex}-${index}`

            try {
                const operation = VMFactory.createRelayerVM(pnsConfig, vmMoniker, ip)
                operations.push(operation)
            } catch (error) {
                console.error(`Error creating ${vmMoniker}`)
                console.error(error)
            }
        }

        // Await chunk of operations  to complete
        const operationResults = await Promise.all(operations)
        totalOperationResults = totalOperationResults.concat(operationResults)
        console.log(operationResults)
    }
    return totalOperationResults
}
