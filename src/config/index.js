import fs from "fs"

export default async function createConfig(moniker, seeds, seedMode, ipv4) {
    const configTemplateStr = await fs.readFileSync(
        "/Users/luyzdeleon/current_projects/pns/src/templates/config.json"
    )
    const configTemplate = JSON.parse(configTemplateStr.toString("utf8"))
    configTemplate.tendermint_config.Moniker = moniker
    configTemplate.tendermint_config.P2P.Seeds = seeds
    configTemplate.tendermint_config.P2P.SeedMode = seedMode
    configTemplate.tendermint_config.P2P.ExternalAddress = `tcp://${ipv4}:26656`
    return configTemplate
}