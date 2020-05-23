import { chunk } from "./util/index.js"
import * as VMFactory from "./factory/index.js"

async function createPocketCoreVMs(
    pnsConfig,
    accounts,
    ips,
    monikerPrefix,
    createVMFunc
) {
    // Create the seed VM's
    const accountsChunks = chunk(accounts, 50)
    const ipsChunks = chunk(ips, 50)
    for (let chunkIndex = 0; chunkIndex < accountsChunks.length; chunkIndex++) {
        const accountsChunk = accountsChunks[chunkIndex]
        const ipsChunk = ipsChunks[chunkIndex]
        const operations = []
        for (let index = 0; index < accountsChunk; index++) {
            const account = accountsChunk[index]
            // Creating Node with account
            console.log(
                "Creating pocket core node with account: " + account.addressHex
            )

            // Create moniker
            const moniker = `${monikerPrefix}-${chunkIndex}-${index}`
            console.log(`VM moniker: ${moniker}`)

            // Get an IP
            const ipv4 = ipsChunk[index]
            console.log(`Pocket Core Node IP: ${ipv4}`)

            // Display Pocket Core config
            const configObj = pnsConfig.createConfig(moniker, true, ipv4)

            // Execute VM creation operation
            const operation = createVMFunc(
                pnsConfig,
                moniker,
                ipv4,
                account,
                configObj
            )
            operations.push(operation)
        }

        // Await chunk of operations  to complete
        const operationResults = await Promise.all(operations)
        console.log(operationResults)
    }
}

export async function createSeedVMs(pnsConfig) {
    const seedAccounts = pnsConfig.seedAccounts
    const seedIps = pnsConfig.seedIps
    await createPocketCoreVMs(
        pnsConfig,
        seedAccounts,
        seedIps,
        "seed",
        VMFactory.createSeedVM
    )
    console.log("Seed Nodes Created")
}

export async function createInitValVMs(pnsConfig) {
    const initValAccounts = pnsConfig.initValAccounts
    const initValIps = pnsConfig.initValIps
    await createPocketCoreVMs(
        pnsConfig,
        initValAccounts,
        initValIps,
        "init-val",
        VMFactory.createInitValVM
    )
    console.log("Initial Validator Nodes Created")
}

export async function createValidatorVMs(pnsConfig) {
    const valAccounts = pnsConfig.initValAccounts
    const validatorIps = pnsConfig.initValIps
    await createPocketCoreVMs(
        pnsConfig,
        valAccounts,
        validatorIps,
        "val",
        VMFactory.createValVM
    )
    console.log("Validator Nodes Created")
}

export async function createRelayerVMs(pnsConfig) {
    const relayerIps = pnsConfig.relayerIps
    const relayerIpChunks = chunk(relayerIps, 50)
    for (
        let chunkIndex = 0;
        chunkIndex < relayerIpChunks.length;
        chunkIndex++
    ) {
        const ipChunks = relayerIpChunks[chunkIndex]
        const relayerOperations = []
        for (let index = 0; index < ipChunks.length; index++) {
            // Relayer node ip
            const relayerIp = ipChunks[index]

            // VM Moniker
            // Create moniker
            const moniker = `relayer-${chunkIndex}-${index}`

            // Log creation
            console.log(`Creating Relayer VM: ${moniker} with ip: ${relayerIp}`)

            const operation = VMFactory.createRelayerVM(
                pnsConfig,
                moniker,
                relayerIp
            )
            relayerOperations.push(operation)
        }
        // Await chunk of operations  to complete
        const operationResults = await Promise.all(relayerOperations)
        console.log(operationResults)
    }
    console.log("Relayer Nodes Created")
}
