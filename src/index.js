import { PnsConfig } from "./config/index.js"
import * as VM from "./vm/index.js"

async function start() {
    // 1.- Create and Load all the common configurations
    const pnsConfig = new PnsConfig()

    // 2.- Start VM creation sequence: Seeds, Initial Validators, Validators, Relayers
    const seedsCreationOperation = await VM.createSeedVMs(pnsConfig)
    const initValsCreationOperation = await VM.createInitValVMs(pnsConfig)
    const validatorsCreationOperation = await VM.createValidatorVMs(pnsConfig)
    const relayersCreationOperation = await VM.createRelayerVMs(pnsConfig)
}

// Start PNS
start()
