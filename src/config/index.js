import { PnsTemplate } from "./template.js"
import * as IPV4Calculator from "ipv4-calculator"
const getNetworkIps = IPV4Calculator.default.getNetworkIps
import { createAccount, createValidatorAccount } from "../accounts/index.js"

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
        this.seedAccounts = []
        this.initialValidatorAccounts = []
        this.validatorAccounts = []
        this.applicationAccounts = []
        this.accounts = []

        // Genesis
        this.genesis = PnsTemplate.pocketCore.genesisTemplate

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
        this.pnsTemplate.relayers.config.dispatchers = this.seedIps
                                                            .concat(this.initialValIps)
                                                            .map(function(seedIp){
                                                                return `http://${seedIp}:8081`
                                                            })
    }

    async initAccounts() {
        // Create seed accounts
        for (let index = 0; index < this.pnsTemplate.seeds.amount; index++) {
            const seedAccount = await createAccount("seed")
            this.seedAccounts.push(seedAccount)
        }

        // Create initial validator accounts
        for (let index = 0; index < this.pnsTemplate.initialValidators.amount; index++) {
            const initValAccount = await createValidatorAccount(
                "initval",
                `http://${this.initialValIps[index]}:8081`
            )
            this.initialValidatorAccounts.push(initValAccount)
        }

        // Create validator accounts
        for (let index = 0; index < this.pnsTemplate.validators.amount; index++) {
            const validatorAccount = await createValidatorAccount(
                "validator",
                `http://${this.initialValIps[index]}:8081`
            )
            this.validatorAccounts.push(validatorAccount)
        }

        // Create application accounts
        for (let index = 0; index < this.pnsTemplate.genesis.applicationsAmont; index++) {
            const appAccount = await createAccount("application")
            this.applicationAccounts.push(appAccount)
        }

        // Create a list of all the accounts
        this.accounts = this.seedAccounts.concat(this.initialValidatorAccounts, this.validatorAccounts, this.applicationAccounts)
        
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

    createGenesisValidator(
        addressHex,
        publicKeyHex,
        tokenAmount,
        serviceURL,
        chains
    ) {
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
        for (let index = 0; index < this.initialValidatorAccounts.length; index++) {
            const validatorAccount = this.initialValidatorAccounts[index]
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

    createConfig(moniker, seedMode, ipv4) {
        const config = this.pnsTemplate.pocketCore.configTemplate
        config.tendermint_config.Moniker = moniker
        config.tendermint_config.P2P.Seeds = this.getSeeds()
        config.tendermint_config.P2P.SeedMode = seedMode
        config.tendermint_config.P2P.ExternalAddress = `tcp://${ipv4}:26656`
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
        if (this.seedAccounts.length - this.seedIps.length !== 0) {
            throw new Error(
                `"Accounts ${accounts.length} vs ips ${ips.length} mismatch`
            )
        }

        const result = []
        for (let index = 0; index < this.seedAccounts.length; index++) {
            const account = this.seedAccounts[index]
            const ip = this.seedIps[index]
            result.push(`${account.addressHex}@${ip}:26656`)
        }
        return result.join(",")
    }

    setGenesisURL(genesisURL) {
        this.genesisURL = genesisURL
    }
}
