"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core_1 = require("@ton/core");
const Kick_1 = require("../wrappers/Kick");
const JettonMinter_1 = require("../wrappers/JettonMinter");
const KickFactory_1 = require("../wrappers/KickFactory");
async function run(provider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let target = 100000000n;
    let expiration = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3);
    const kickFactory = provider.open(KickFactory_1.KickFactory.createFromAddress(core_1.Address.parse("EQBk2uXgGwdFWCZQ1j5WvuEVTIUSbD6vEtc9suHKpBZzhOji")));
    let kickAddress = await kickFactory.getKickContract(target, expiration, addr, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);
    // that's our jetton for testing
    const usdtMaster = provider.open(JettonMinter_1.JettonMinter.createFromAddress(core_1.Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));
    const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);
    await kickFactory.sendKick(provider.sender(), (0, core_1.toNano)('0.1'), 999n, target, expiration, kickUsdtAddr, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);
    const reputation = provider.open(Kick_1.Kick.createFromAddress(kickAddress));
    // TODO: send method
}
