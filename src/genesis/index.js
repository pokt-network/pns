//const fs = require("fs")
import fs from "fs"

function createGenesisAccount(addressHex, publicKeyHex, tokenAmount) {
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

function createGenesisValidator(
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

export default async function createGenesis(accounts, validatorAccounts) {
    const genesisTemplateStr = await fs.readFileSync(
        "/Users/luyzdeleon/current_projects/pns/src/templates/genesis.json"
    )
    const genesisTemplate = JSON.parse(genesisTemplateStr.toString("utf8"))
    const genesisAccounts = []
    const genesisValidators = []

    // Generate genesis accounts
    for (let index = 0; index < accounts.length; index++) {
        const account = accounts[index];
        const genesisAccount = createGenesisAccount(
            account.addressHex,
            account.publicKeyHex,
            "18446743929695151615"
        )
        genesisAccounts.push(genesisAccount)
    }

    // Generate genesis validators
    for (let index = 0; index < validatorAccounts.length; index++) {
        const validatorAccount = validatorAccounts[index];
        const genesisValidator = createGenesisValidator(
            validatorAccount.addressHex,
            validatorAccount.publicKeyHex,
            "18446743929695151615",
            validatorAccount.serviceURL,
            ["0001"]
        )
        genesisValidators.push(genesisValidator)
    }

    genesisTemplate.app_state.auth.accounts = genesisAccounts
    genesisTemplate.app_state.pos.validators = genesisValidators
    return genesisTemplate
}
