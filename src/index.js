import { PnsConfig } from "./config/index.js"
import * as VM from "./vm/index.js"

async function start() {
    // 1.- Create and Load all the common configurations
    const pnsConfig = new PnsConfig()

    // 2.- Start VM creation sequence: Seeds, Initial Validators, Validators, Relayers
    const seedsCreationOperation = VM.createSeedVMs(pnsConfig)
    const initValsCreationOperation = undefined
    const validatorsCreationOperation = undefined
    const relayersCreationOperation = undefined

    await Promise.all([
        seedsCreationOperation,
        initValsCreationOperation,
        validatorsCreationOperation,
        relayersCreationOperation,
    ])
}
