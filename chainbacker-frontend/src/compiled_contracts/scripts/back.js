"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core_1 = require("@ton/core");
const JettonMinter_1 = require("../wrappers/JettonMinter");
const JettonWallet_1 = require("../wrappers/JettonWallet");
async function run(provider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    // let code = await compile("Backer");
    // const kick = provider.open(Kick.createFromConfig({ target: 100000000n, expiration: BigInt(Date.now() + 60 * 60 * 24 * 3), creator: addr, milestones: [{ part: 100n }], tiers: [{ amount: 1000n, price: 100000n }], code }, await compile('Kick')));
    const usdtMaster = provider.open(JettonMinter_1.JettonMinter.createFromAddress(core_1.Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));
    const kickAddress = core_1.Address.parse("EQCLlnXz4uk1gts4ty7PP6Teh04JaprRDixwsK4lnSvjxr2C");
    // const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);
    const myUsdtAddr = await usdtMaster.getWalletAddress(addr);
    const myWallet = provider.open(JettonWallet_1.JettonWallet.createFromAddress(myUsdtAddr));
    const forwardPayload = (0, core_1.beginCell)()
        .storeUint(0, 8)
        .storeUint(1, 16)
        .endCell();
    await myWallet.sendTransfer(provider.sender(), (0, core_1.toNano)('0.1'), 100000n, kickAddress, addr, core_1.Cell.EMPTY, (0, core_1.toNano)('0.05'), forwardPayload);
    // let res = await reputation.sendUsdtWallet(provider.sender(), toNano('0.05'), 2n, kickUsdtAddr);
    // TODO: send method
}
