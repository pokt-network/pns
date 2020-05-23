import Compute from "@google-cloud/compute"

export default async function (
    dryRun,
    zoneName,
    machineType,
    projectID,
    vmName,
    networkName,
    networkIP,
    startupScript
) {
    // GCP Clients
    const compute = new Compute({ projectId: projectID })
    const zone = compute.zone(zoneName)

    // VM config
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

    // Execute operation
    if (!dryRun) {
        const vm = zone.vm(vmName)
        console.log(`Creating VM ${vmName}...`)
        const [createdVM, operation, apiResponse] = await vm.create(config)
        console.log(`Polling operation ${operation.id}...`)
        return operation.promise()
    } else {
        return Promise.resolve()
    }
}
