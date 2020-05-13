import * as StartupScript from "./startup-script.js"
const createStartupScript = StartupScript.default

export async function createVM(
    zone,
    machineType,
    projectID,
    vmName,
    networkName,
    networkIP,
    seedAccount,
    passphrase,
    genesisObj,
    configObj,
    chainsObj
) {
    // VM Config
    const startupScript = createStartupScript(
        genesisObj,
        configObj,
        chainsObj,
        seedAccount,
        passphrase
    )
    console.log(startupScript)
    const config = {
        machineType: machineType,
        os: "ubuntu",
        networkInterfaces: [
            {
                network: `projects/${projectID}/global/networks/${networkName}`,
                networkIP: networkIP,
                accessConfigs: [{ networkTier: "PREMIUM" }],
            },
        ],
        metadata: {
            items: [
                {
                    key: "startup-script",
                    value: startupScript,
                },
            ],
        },
    }

    const vm = zone.vm(vmName)

    console.log(`Creating VM ${vmName}...`)
    const [createdVM, operation, apiResponse] = await vm.create(config)
    // console.log(createdVM)
    // console.log(operation)
    // console.log(apiResponse)
    console.log(`Polling operation ${operation.id}...`)
    return operation.promise()
}
