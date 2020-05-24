import { PnsConfig } from "./config/index.js"
import * as VM from "./vm/index.js"
import * as PromptSync from "prompt-sync"

async function start() {
    // 1.- Create and Load all the common configurations
    const pnsConfig = new PnsConfig()
    await pnsConfig.init()

    // 2.- Output genesis to console
    console.log(JSON.stringify(pnsConfig.genesis))

    // 3.- Input and capture genesis url
    const genesisURL = PromptSync.default()("Input genesis url: ")
    pnsConfig.setGenesisURL(genesisURL)
    console.log("Genesis URL: " + genesisURL)

    // 4.- Start VM creation sequence: Seeds, Initial Validators, Validators, Relayers

    // Create seeds and wait
    await VM.createSeedVMs(pnsConfig)
    // Await before the next execution
    await new Promise((r) => setTimeout(r, 300000))

    // Create initial validators and wait
    await VM.createInitValVMs(pnsConfig)
    // Await before the next execution
    await new Promise((r) => setTimeout(r, 300000))

    // Create validators and wait
    await VM.createValidatorVMs(pnsConfig)
    // Await before the next execution
    await new Promise((r) => setTimeout(r, 300000))

    // Create relayers
    await VM.createRelayerVMs(pnsConfig)
}

// Start PNS
start()
