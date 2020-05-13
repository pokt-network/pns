// Dependencies
import Compute from "@google-cloud/compute"
import { createAccount, createValidatorAccount } from "./accounts/index.js"
import * as IPV4Calculator from "ipv4-calculator"
import * as VM from "./vm/index.js"
import * as Genesis from "./genesis/index.js"
const createGenesis = Genesis.default
import * as Config from "./config/index.js"
const createConfig = Config.default
import * as ShortID from "shortid"
import * as Randexp from "randexp"

async function start(
    seedsAmount,
    validatorsAmount,
    networkRange,
    networkName,
    machineType,
    zoneName,
    projectID
) {
    // Validate we have enough IP's
    const networkIPs = IPV4Calculator.default.getNetworkIps(networkRange)
    networkIPs.splice(0, 2)
    if (seedsAmount + validatorsAmount > networkIPs.length) {
        throw new Error("Not enough IP's provisioned")
    }

    // Create then network for the VM's
    const compute = new Compute({ projectId: projectID })
    const zone = compute.zone(zoneName)

    // Declare constants
    const seedAccounts = []
    const validatorAccounts = []
    const seedIPs = networkIPs.splice(0, seedsAmount)
    const validatorIPs = networkIPs
    const tendermintSeeds = []
    const seedOperations = []
    const validatorOperations = []

    // Create seed accounts
    for (let index = 0; index < seedsAmount; index++) {
        const seedAccount = await createAccount("test")
        seedAccounts.push(seedAccount)
    }

    // Create validator accounts
    for (let index = 0; index < validatorsAmount; index++) {
        const validatorAccount = await createValidatorAccount(
            "testval",
            `http://${validatorIPs[index]}:8081`
        )
        validatorAccounts.push(validatorAccount)
    }

    // Create genesis obj
    const genesisObj = await createGenesis(
        seedAccounts.concat(validatorAccounts),
        validatorAccounts
    )

    // Create the seed VM's
    for (let index = 0; index < seedsAmount; index++) {
        const seedAccount = seedAccounts[index]
        // Creating Seed Node with account
        console.log("Creating seed node with account")
        console.log(JSON.stringify(seedAccount))

        // Create moniker
        const moniker = `seed-${index}`
        console.log(`Seed Node moniker: ${moniker}`)

        // Get an IP
        const ipv4 = seedIPs[index]
        console.log(`Seed Node IP: ${ipv4}`)

        // Display tendermint seed id
        const tendermintSeed = `${seedAccount.addressHex}@${ipv4}:26656`
        console.log(`Tendermint Seed: ${tendermintSeed}`)
        tendermintSeeds.push(tendermintSeed)

        // Display Pocket Core config
        const configObj = await createConfig(moniker, "", true, ipv4)

        // Seed vm's are created with empty chains object
        const operation = await VM.createVM(
            zone,
            machineType,
            projectID,
            moniker,
            networkName,
            ipv4,
            seedAccount,
            "seedpassphrase",
            genesisObj,
            configObj,
            []
        )
        seedOperations.push(operation)
    }

    const seedOperationResults = await Promise.all(seedOperations)
    console.log(seedOperationResults)

    // Create seeds string
    const seeds = tendermintSeeds.join(",")

    // Create the seed VM's
    for (let index = 0; index < validatorsAmount; index++) {
        const validatorAccount = validatorAccounts[index]
        // Creating Seed Node with account
        console.log("Creating validator node with account")
        console.log(JSON.stringify(validatorAccount))

        // Create moniker
        const moniker = `validator-${index}`
        console.log(`Validator Node moniker: ${moniker}`)

        // Get an IP
        const ipv4 = validatorIPs[index]
        console.log(`Validator Node IP: ${ipv4}`)

        // Display Pocket Core config
        const configObj = await createConfig(moniker, seeds, false, ipv4)

        // Seed vm's are created with empty chains object
        const operation = await VM.createVM(
            zone,
            machineType,
            projectID,
            moniker,
            networkName,
            ipv4,
            validatorAccount,
            "valpassphrase",
            genesisObj,
            configObj,
            [{ id: "0001", url: "http://localhost:8545" }]
        )
        validatorOperations.push(operation)
    }

    const validatorOperationResults = await Promise.all(validatorOperations)
    console.log(validatorOperationResults)
}

start(
    1,
    5,
    "10.128.0.0/20",
    "default",
    "e2-standard-2",
    "us-central1-c",
    "validator-load-test"
)
