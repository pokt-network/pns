import { PnsConfig } from "./config/index.js"
import * as VM from "./vm/index.js"

async function start() {
    // 1.- Create and Load all the common configurations
    const pnsConfig = new PnsConfig()
    await pnsConfig.init()

    // 2.- Start VM creation sequence: Seeds, Initial Validators, Validators, Relayers
    await VM.createSeedVMs(pnsConfig)
    await VM.createInitValVMs(pnsConfig)
    await VM.createValidatorVMs(pnsConfig)
    // Wait blockTime to elapse before starting the relayers
    setTimeout(async function () {
        await VM.createRelayerVMs(pnsConfig)
    },
    pnsConfig.pnsTemplate.pocketCore.blockTime * 60000)
}

// Start PNS
start()
