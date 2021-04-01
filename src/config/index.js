import { PnsTemplate } from "./template.js"
import * as IPV4Calculator from "ipv4-calculator"
const getNetworkIps = IPV4Calculator.default.getNetworkIps
import { createAccount, createValidatorAccount } from "../accounts/index.js"
import * as shortid from "shortid"
import * as GCPStorage from "@google-cloud/storage"

export class PnsConfig {
    constructor() {
        // Template
        this.pnsTemplate = PnsTemplate

        // Networking defaults
        this.seedIps = []
        this.initialValIps = []
        this.validatorIps = []
        this.relayerIps = []

        // Account defaults
        this.seedAccounts = {}
        this.initialValidatorAccounts = {}
        this.validatorAccounts = {}
        this.allInitialValidatorAccounts = []
        this.applicationAccounts = []
        this.accounts = []

        // Genesis
        this.genesis = PnsTemplate.pocketCore.genesisTemplate

        // Storage bucket
        this.storageBucket = shortid.default.generate().toLowerCase()
        // Test ID
        this.testID = this.storageBucket
    }

    async init() {
        // Initialize networking
        this.initNetworking()
        // Initialize accounts
        await this.initAccounts()
        // Initialize Genesis
        this.initGenesis()
        // Initialize relayer configurations
        this.initRelayerConfigs()
    }

    initRelayerConfigs() {
        if (this.pnsTemplate.relayers.testType !== "dispatch") {
            return
        }

        const appPrivateKeys = this.applicationAccounts.map(function(appAccount) {
            return appAccount.privateKeyHex
        })

        console.log("Application Private Keys")
        console.log(appPrivateKeys)

        this.pnsTemplate.relayers.config.chains = [
            {
                hash: "0001",
                application_private_keys: appPrivateKeys,
                payloads: [
                    {
                        data:
                            '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x5737E23bFe3B0bE0e369d7e8600EE275eD08A86a", "latest"],"id":1}',
                        blockchain: "0001",
                        consensus_enabled: false,
                        path: "",
                    },
                ],
            },
        ]
    }

    initNetworking() {
        const networkIps = getNetworkIps(this.pnsTemplate.network.range)
        // Remove the broadcast and gateway ip's as they are already occupied
        networkIps.splice(0, 2)
        if (
            this.pnsTemplate.seeds.amount +
                this.pnsTemplate.initialValidators.amount +
                this.pnsTemplate.validators.amount +
                this.pnsTemplate.relayers.amount >
            networkIps.length
        ) {
            throw new Error("Not enough IP's provisioned")
        }

        // Set the IP's for each
        this.seedIps = networkIps.splice(0, this.pnsTemplate.seeds.amount)
        this.initialValIps = networkIps.splice(0, this.pnsTemplate.initialValidators.amount)
        this.validatorIps = networkIps.splice(0, this.pnsTemplate.validators.amount)
        this.relayerIps = networkIps.splice(0, this.pnsTemplate.relayers.amount)
    }

    async initAccounts() {
        // Create seed accounts
        for (let index = 0; index < this.seedIps.length; index++) {
            const seedIP = this.seedIps[index]
            this.seedAccounts[seedIP] = []
            for (let accountIdx = 0; accountIdx < this.pnsTemplate.seeds.processes; accountIdx++) {
                const seedAccount = await createAccount("seed")
                this.seedAccounts[seedIP].push(seedAccount)
                this.accounts.push(seedAccount)
            }
        }

        // Create initial validator accounts
        for (let index = 0; index < this.initialValIps.length; index++) {
            const initValIp = this.initialValIps[index]
            this.initialValidatorAccounts[initValIp] = []
            let pocketRPCPort = 8081
            for (let accountIdx = 0; accountIdx < this.pnsTemplate.initialValidators.processes; accountIdx++) {
                const initValAccount = await createValidatorAccount("initval", `http://${initValIp}:${pocketRPCPort}`)
                this.initialValidatorAccounts[initValIp].push(initValAccount)
                this.allInitialValidatorAccounts.push(initValAccount)
                this.accounts.push(initValAccount)
                pocketRPCPort = pocketRPCPort + 1
            }
        }

        // Create validator accounts
        for (let index = 0; index < this.validatorIps.length; index++) {
            const validatorIp = this.validatorIps[index]
            this.validatorAccounts[validatorIp] = []
            let pocketRPCPort = 8081
            for (let accountIdx = 0; accountIdx < this.pnsTemplate.validators.processes; accountIdx++) {
                const validatorAccount = await createValidatorAccount(
                    "validator",
                    `http://${validatorIp}:${pocketRPCPort}`
                )
                this.validatorAccounts[validatorIp].push(validatorAccount)
                this.accounts.push(validatorAccount)
                pocketRPCPort = pocketRPCPort + 1
            }
        }

        // Create application accounts
        for (let index = 0; index < this.pnsTemplate.genesis.applicationsAmount; index++) {
            const appAccount = await createAccount("application")
            this.applicationAccounts.push(appAccount)
        }

        // Create a list of all the accounts
        this.accounts = this.accounts.concat(this.applicationAccounts)

        // Set the relayer faucet pk
        if (this.accounts[0]) {
            this.pnsTemplate.relayers.config.faucet_pk = this.accounts[0].privateKeyHex
        }

        // Set the relayers dispatchers
        for (let index = 0; index < this.initialValIps.length; index++) {
            const ip = this.initialValIps[index]
            const initialValidatorAccounts = this.initialValidatorAccounts[ip]
            let pocketRpcPort = 8081
            for (let accountIdx = 0; accountIdx < initialValidatorAccounts.length; accountIdx++) {
                const initValAccount = initialValidatorAccounts[accountIdx]
                this.pnsTemplate.relayers.config.dispatchers.push(`http://${ip}:${pocketRpcPort}`)
                pocketRpcPort = pocketRpcPort + 1
            }
        }
        //this.pnsTemplate.relayers.config.dispatchers = this.shuffle(this.pnsTemplate.relayers.config.dispatchers)
        //this.pnsTemplate.relayers.config.dispatchers.splice(0, this.pnsTemplate.relayers.config.dispatchers.length/2)
    }

    // Genesis
    createGenesisAccount(addressHex, publicKeyHex, tokenAmount) {
        return {
            type: "posmint/Account",
            value: {
                address: addressHex,
                coins: [
                    {
                        denom: "upokt",
                        amount: tokenAmount,
                    },
                ],
                public_key: {
                    type: "crypto/ed25519_public_key",
                    value: publicKeyHex,
                },
            },
        }
    }

    createGenesisApplication(addressHex, publicKeyHex, chains) {
        return {
            address: addressHex,
            chains: chains,
            jailed: false,
            max_relays: this.pnsTemplate.genesis.defaultApplicationMaxRelays,
            public_key: publicKeyHex,
            staked_tokens: this.pnsTemplate.genesis.defaultApplicationStake,
            status: 2,
            unstaking_time: "1970-01-01T00:00:00Z",
        }
    }

    createGenesisValidator(addressHex, publicKeyHex, tokenAmount, serviceURL, chains) {
        return {
            address: addressHex,
            public_key: publicKeyHex,
            jailed: false,
            status: 2,
            tokens: tokenAmount,
            service_url: serviceURL,
            chains: chains,
            unstaking_time: "0001-01-01T00:00:00Z",
        }
    }

    getRandomStake(min, max) {
        return Math.trunc(Math.abs(Math.random() * (max - min) + min)).toString()
    }

    initGenesis() {
        const genesisAccounts = []
        const genesisValidators = []
        const genesisApplications = []

        // Generate genesis accounts
        for (let index = 0; index < this.accounts.length; index++) {
            const account = this.accounts[index]
            const genesisAccount = this.createGenesisAccount(
                account.addressHex,
                account.publicKeyHex,
                this.pnsTemplate.genesis.defaultAccountAmount
            )
            genesisAccounts.push(genesisAccount)
        }

        // Generate genesis validators
        for (let index = 0; index < this.allInitialValidatorAccounts.length; index++) {
            const validatorAccount = this.allInitialValidatorAccounts[index]
            const genesisValidator = this.createGenesisValidator(
                validatorAccount.addressHex,
                validatorAccount.publicKeyHex,
                "999999999999", //this.getRandomStake(10000000, 999999999999),
                validatorAccount.serviceURL,
                this.pnsTemplate.initialValidators.chains
            )
            genesisValidators.push(genesisValidator)
        }

        // Generate genesis applications
        for (let index = 0; index < this.applicationAccounts.length; index++) {
            const applicationAccount = this.applicationAccounts[index]
            const genesisApplication = this.createGenesisApplication(
                applicationAccount.addressHex,
                applicationAccount.publicKeyHex,
                this.pnsTemplate.initialValidators.chains
            )
            genesisApplications.push(genesisApplication)
        }

        this.genesis.chain_id = this.pnsTemplate.genesis.chainId
        this.genesis.app_state.auth.accounts = genesisAccounts
        this.genesis.app_state.pos.validators = genesisValidators
        this.genesis.app_state.application.applications = genesisApplications
    }

    createConfig(
        moniker,
        seedMode,
        ipv4,
        numInboundPeers,
        numOutboundPeers,
        externalAddressPort,
        proxyAppPort,
        rpcListenPort,
        pocketCoreRpcPort,
        rootDir,
        tendermintRpcMaxConns
    ) {
        const config = JSON.parse(JSON.stringify(this.pnsTemplate.pocketCore.configTemplate))
        // Tendermint configs
        config.tendermint_config.Moniker = moniker
        // if (seedMode === false) {
        //     config.tendermint_config.P2P.Seeds = this.getSeeds()
        // } else {
        //     // Don't set seeds for the seed nodes
        //     config.tendermint_config.P2P.Seeds = ""
        // }
        // if (seedMode === false) {
        //     config.tendermint_config.P2P.PersistentPeers = this.getPersistentPeers(ipv4)
        // }
        config.tendermint_config.P2P.Seeds = this.getSeeds() 
        config.tendermint_config.P2P.SeedMode = seedMode
        config.tendermint_config.P2P.ExternalAddress = `tcp://${ipv4}:${externalAddressPort}`
        config.tendermint_config.P2P.ListenAddress = `tcp://0.0.0.0:${externalAddressPort}`
        config.tendermint_config.P2P.MaxNumInboundPeers = numInboundPeers
        config.tendermint_config.P2P.MaxNumOutboundPeers = numOutboundPeers
        config.tendermint_config.ProxyApp = `tcp://127.0.0.1:${proxyAppPort}`
        config.tendermint_config.RPC.ListenAddress = `tcp://127.0.0.1:${rpcListenPort}`
        config.tendermint_config.RootDir = rootDir
        config.tendermint_config.RPC.RootDir = rootDir
        config.tendermint_config.P2P.RootDir = rootDir
        config.tendermint_config.Mempool.RootDir = rootDir
        config.tendermint_config.Consensus.RootDir = rootDir
        config.tendermint_config.RPC.GRPCMaxOpenConnections = tendermintRpcMaxConns
        config.tendermint_config.RPC.MaxOpenConnections = tendermintRpcMaxConns
        config.tendermint_config.P2P.AllowDuplicateIP = true ///seedMode === false ? false : true
        // Pocket Core configs
        config.pocket_config.tendermint_uri = `tcp://localhost:${rpcListenPort}`
        config.pocket_config.rpc_port = pocketCoreRpcPort
        config.pocket_config.remote_cli_url = `http://localhost:${pocketCoreRpcPort}`
        config.pocket_config.data_dir = rootDir
        config.pocket_config.pocket_prometheus_port = (pocketCoreRpcPort * 2).toString()
        return config
    }

    createRelayerConfiguration() {
        return this.pnsTemplate.relayers.config
    }

    getSeedsAmount() {
        return this.pnsTemplate.seeds.amount
    }

    getInitialValidatorsAmount() {
        return this.pnsTemplate.initialValidators.amount
    }

    getValidatorsAmount() {
        return this.pnsTemplate.validators.amount
    }

    getRelayersAmount() {
        return this.pnsTemplate.relayers.amount
    }

    shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    }

    getPersistentPeers(nodeIp) {
        let result = []
        let nodeIpIndex = this.initialValIps.indexOf(nodeIp)
        if (nodeIpIndex === -1) {
            throw new Error(`NodeIp ${nodeIp} not found in initialValIps`)
            //return result.join(",")
        }

        let peerIp
        // Check if I'm the last index of the array
        console.log(`NodeIP index ${nodeIpIndex}`)
        if (nodeIpIndex === this.initialValIps.length - 1) {
            peerIp = this.initialValIps[0]
        } else {
            peerIp = this.initialValIps[nodeIpIndex + 1]
        }
        console.log(`${nodeIp} peer is ${peerIp}`)

        let p2pPort = 26656
        let initValAccounts = this.initialValidatorAccounts[peerIp]
        for (let accountIdx = 0; accountIdx < initValAccounts.length; accountIdx++) {
            const initValAccount = initValAccounts[accountIdx]
            result.push(`${initValAccount.addressHex}@${peerIp}:${p2pPort}`)
            p2pPort = p2pPort + 1000
        }

        // Get another random instance and repeat the process
        peerIp = this.initialValIps[Math.floor(Math.random() * this.initialValIps.length)]
        console.log(`${nodeIp} secondary peer is ${peerIp}`)

        p2pPort = 26656
        initValAccounts = this.initialValidatorAccounts[peerIp]
        for (let accountIdx = 0; accountIdx < initValAccounts.length; accountIdx++) {
            const initValAccount = initValAccounts[accountIdx]
            result.push(`${initValAccount.addressHex}@${peerIp}:${p2pPort}`)
            p2pPort = p2pPort + 1000
        }

        return result.join(",")
    }

    getSeeds() {
        const result = []
        for (let index = 0; index < this.seedIps.length; index++) {
            const seedIP = this.seedIps[index]
            let seedP2PPort = 26656
            const seedAccounts = this.seedAccounts[seedIP]
            for (let accountIdx = 0; accountIdx < seedAccounts.length; accountIdx++) {
                const seedAccount = seedAccounts[accountIdx]
                result.push(`${seedAccount.addressHex}@${seedIP}:${seedP2PPort}`)
                seedP2PPort = seedP2PPort + 1000
            }
        }
        console.log("Seeds: " + result.join(","))
        return result.join(",")
    }

    setGenesisURL(genesisURL) {
        this.genesisURL = genesisURL
    }

    async createStartupScriptBucket() {
        const storage = new GCPStorage.default.Storage({
            projectId: this.pnsTemplate.projectID,
            keyFilename: "/Users/luyzdeleon/validator-load-test-creds.json"
        })
        const [bucket, operation] = await storage.createBucket(this.storageBucket)
        this.startupScriptBucket = bucket
    }
}
