import Compute from "@google-cloud/compute"

export default async function createVM(
    dryRun,
    zoneName,
    machineType,
    projectID,
    vmName,
    networkName,
    networkIP,
    startupScript
) {
    try {
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
                    {
                        key: "enable-oslogin",
                        value: "TRUE",
                    },
                ],
            },
        }

        // Execute operation
        if (!dryRun) {
            const vm = zone.vm(vmName)
            return vm.create(config)
        } else {
            return Promise.resolve()
        }
    } catch (error) {
        console.log(error)
        return createVM(dryRun, zoneName, machineType, projectID, vmName, networkName, networkIP, startupScript)
    }
}
