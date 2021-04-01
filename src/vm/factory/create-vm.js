import Compute from "@google-cloud/compute"

export default async function createVM(
    dryRun,
    zoneName,
    machineType,
    projectID,
    vmName,
    networkName,
    networkIP,
    startupScript,
    diskSizeGb
) {
    try {
        // GCP Clients
        const compute = new Compute({ projectId: projectID })
        const zone = compute.zone(zoneName)

        // VM config
        const config = {
            machineType: machineType,
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
            disks: [
                {
                    boot: true,
                    autoDelete: true,
                    initializeParams: {
                        sourceImage: `projects/ubuntu-os-cloud/global/images/ubuntu-1804-bionic-v20200529`,
                        diskSizeGb: diskSizeGb
                    },
                },
            ],
        }

        // Execute operation
        if (!dryRun) {
            const vm = zone.vm(vmName)
            console.log(vm)
            return vm.create(config)
        } else {
            return Promise.resolve()
        }
    } catch (error) {
        console.log(error)
        return createVM(dryRun, zoneName, machineType, projectID, vmName, networkName, networkIP, startupScript)
    }
}
