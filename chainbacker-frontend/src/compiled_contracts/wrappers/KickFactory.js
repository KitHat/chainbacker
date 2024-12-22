"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KickFactory = void 0;
exports.kickFactoryConfigToCell = kickFactoryConfigToCell;
const core_1 = require("@ton/core");
function kickFactoryConfigToCell(config) {
    return (0, core_1.beginCell)()
        .storeRef(config.kickCode)
        .storeRef(config.backCode)
        .storeAddress(config.comissionWallet)
        .endCell();
}
class KickFactory {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new KickFactory(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = kickFactoryConfigToCell(config);
        const init = { code, data };
        return new KickFactory((0, core_1.contractAddress)(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().endCell(),
        });
    }
    // Getters
    async getKickContract(provider, target, expiration, creator, milestones, tiers) {
        let milestoneCell = (0, core_1.beginCell)();
        for (const m of milestones) {
            milestoneCell = milestoneCell.storeUint(m.part, 8);
        }
        let tierCell = (0, core_1.beginCell)();
        for (const t of tiers) {
            tierCell = tierCell.storeUint(t.amount, 16).storeUint(0, 16).storeUint(t.price, 64);
        }
        const result = (await provider.get('get_kick_address', [
            { type: "int", value: target },
            { type: "int", value: expiration },
            { type: "int", value: BigInt(tiers.length) },
            { type: "slice", cell: (0, core_1.beginCell)().storeAddress(creator).endCell() },
            { type: "cell", cell: milestoneCell.endCell() },
            { type: "cell", cell: tierCell.endCell() },
        ])).stack;
        return result.readAddress();
    }
    // Setters. 
    async sendKick(provider, via, value, queryId, target, expiration, usdtWallet, milestones, tiers) {
        let milestoneCell = (0, core_1.beginCell)();
        for (const m of milestones) {
            milestoneCell = milestoneCell.storeUint(m.part, 8);
        }
        let tierCell = (0, core_1.beginCell)();
        for (const t of tiers) {
            tierCell = tierCell.storeUint(t.amount, 16).storeUint(0, 16).storeUint(t.price, 64);
        }
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)()
                .storeUint(queryId, 64)
                .storeUint(target, 64)
                .storeUint(expiration, 64)
                .storeUint(tiers.length, 8)
                .storeAddress(usdtWallet)
                .storeRef(milestoneCell.endCell())
                .storeRef(tierCell.endCell())
                .endCell()
        });
    }
}
exports.KickFactory = KickFactory;
