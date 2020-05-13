import * as PocketJS from "@pokt-network/pocket-js"
const Keybase = PocketJS.default.Keybase
const InMemoryKVStore = PocketJS.default.InMemoryKVStore

export class Account {
    constructor(privateKeyBuffer, publicKeyBuffer, addressBuffer) {
        this.privateKey = privateKeyBuffer
        this.privateKeyHex = this.privateKey.toString("hex")
        this.publicKey = publicKeyBuffer
        this.publicKeyHex = this.publicKey.toString("hex")
        this.address = addressBuffer
        this.addressHex = this.address.toString("hex")
    }
}

export async function createAccount(passphrase) {
    const keybase = new Keybase(new InMemoryKVStore())
    const account = await keybase.createAccount(passphrase)
    const unlockedAccount = await keybase.getUnlockedAccount(
        account.addressHex,
        passphrase
    )
    return new Account(
        unlockedAccount.privateKey,
        account.publicKey,
        account.address
    )
}

export class ValidatorAccount extends Account {
    constructor(privateKeyBuffer, publicKeyBuffer, addressBuffer, serviceURL) {
        super(privateKeyBuffer, publicKeyBuffer, addressBuffer)
        this.serviceURL = serviceURL
    }
}

export async function createValidatorAccount(passphrase, serviceURL) {
    const account = await createAccount(passphrase)
    return new ValidatorAccount(
        account.privateKey,
        account.publicKey,
        account.address,
        serviceURL
    )
}
