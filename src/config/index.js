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
    }

    async init() {
        // Initialize networking
        this.initNetworking()
        // Initialize accounts
        await this.initAccounts()
        // Initialize Genesis
        this.initGenesis()
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

        // Set the relayers dispatchers
        this.pnsTemplate.relayers.config.dispatchers = this.seedIps.concat(this.initialValIps).map(function (seedIp) {
            return `http://${seedIp}:8081`
        })
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
        this.accounts = this.accounts.concat(
            this.applicationAccounts
        )

        // Set the relayer faucet pk
        if (this.accounts[0]) {
            this.pnsTemplate.relayers.config.faucet_pk = this.accounts[0].privateKeyHex
        }
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
                this.pnsTemplate.genesis.defaultValidatorStake,
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
        if (seedMode === false) {
            config.tendermint_config.P2P.Seeds = this.getSeeds()
        } else {
            // Don't set seeds for the seed nodes
            config.tendermint_config.P2P.Seeds = ""
        }
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
        config.tendermint_config.P2P.AllowDuplicateIP = seedMode === false ? false : true
        // Pocket Core configs
        config.pocket_config.tendermint_uri = `tcp://localhost:${rpcListenPort}`
        config.pocket_config.rpc_port = pocketCoreRpcPort
        config.pocket_config.remote_cli_url = `http://localhost:${pocketCoreRpcPort}`
        config.pocket_config.data_dir = rootDir
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

    getSeeds() {
        const result = []
        for (let index = 0; index < this.seedIps.length; index++) {
            const seedIP = this.seedIps[index];
            let seedP2PPort = 26656
            const seedAccounts = this.seedAccounts[seedIP]
            for (let accountIdx = 0; accountIdx < seedAccounts.length; accountIdx++) {
                const seedAccount = seedAccounts[accountIdx];
                result.push(`${seedAccount.addressHex}@${seedIP}:${seedP2PPort}`)
                seedP2PPort = seedP2PPort + 1000
            }
        }
        return result.join(",")
    }

    setGenesisURL(genesisURL) {
        this.genesisURL = genesisURL
    }

    async createStartupScriptBucket() {
        const storage = new GCPStorage.default.Storage()
        const [bucket, operation] = await storage.createBucket(this.storageBucket)
        this.startupScriptBucket = bucket
    }
}
