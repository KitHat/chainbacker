"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core_1 = require("@ton/core");
const blueprint_1 = require("@ton/blueprint");
const KickFactory_1 = require("../wrappers/KickFactory");
async function run(provider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let backCode = await (0, blueprint_1.compile)("Backer");
    let kickCode = await (0, blueprint_1.compile)("Kick");
    const kickFactory = provider.open(KickFactory_1.KickFactory.createFromConfig({ kickCode, backCode, comissionWallet: addr }, await (0, blueprint_1.compile)('KickFactory')));
    await kickFactory.sendDeploy(provider.sender(), (0, core_1.toNano)('0.1'));
    await provider.waitForDeploy(kickFactory.address);
    // TODO: send method
}
