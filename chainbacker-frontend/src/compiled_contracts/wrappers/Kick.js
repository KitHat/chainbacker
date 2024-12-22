"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kick = void 0;
exports.kickConfigToCell = kickConfigToCell;
exports.kickConfigToCellFull = kickConfigToCellFull;
const core_1 = require("@ton/core");
function kickConfigToCell(config) {
    let tiers = (0, core_1.beginCell)();
    for (const tier of config.tiers) {
        tiers = tiers.storeUint(tier.amount, 16).storeUint(0, 16).storeUint(tier.price, 64);
    }
    let milestones = (0, core_1.beginCell)();
    for (const milestone of config.milestones) {
        milestones = milestones.storeUint(milestone.part, 8);
    }
    return (0, core_1.beginCell)()
        .storeUint(0, 64)
        .storeUint(config.target, 64)
        .storeUint(config.expiration, 64)
        .storeUint(0, 64)
        .storeUint(0, 64)
        .storeUint(0, 1)
        .storeUint(0, 8)
        .storeUint(config.tiers.length, 8)
        .storeUint(1, 1)
        .storeAddress(config.creator)
        .storeRef(milestones.endCell())
        .storeRef(tiers.endCell())
        .storeRef(config.code)
        .storeRef((0, core_1.beginCell)()
        .storeAddress(config.usdtWallet)
        .storeAddress(config.comissionWallet)
        .endCell())
        .endCell();
}
// TEST-ONLY CONFIGS
function kickConfigToCellFull(config) {
    let tiers = (0, core_1.beginCell)();
    for (const tier of config.tiers) {
        tiers = tiers.storeUint(tier.amount, 16).storeUint(0, 16).storeUint(tier.price, 64);
    }
    let milestones = (0, core_1.beginCell)();
    for (const milestone of config.milestones) {
        milestones = milestones.storeUint(milestone.part, 8);
    }
    return (0, core_1.beginCell)()
        .storeUint(config.collected, 64)
        .storeUint(config.target, 64)
        .storeUint(config.expiration, 64)
        .storeUint(0, 64)
        .storeUint(0, 64)
        .storeUint(0, 1)
        .storeUint(0, 8)
        .storeUint(config.tiers.length, 8)
        .storeUint(1, 1)
        .storeAddress(config.creator)
        .storeRef(milestones.endCell())
        .storeRef(tiers.endCell())
        .storeRef(config.code)
        .storeRef((0, core_1.beginCell)()
        .storeAddress(config.usdtWallet)
        .storeAddress(config.comissionWallet)
        .endCell())
        .endCell();
}
class Kick {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new Kick(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = kickConfigToCell(config);
        const init = { code, data };
        return new Kick((0, core_1.contractAddress)(workchain, init), init);
    }
    // TEST ONLY CONFIG
    static createFromConfigFull(config, code, workchain = 0) {
        const data = kickConfigToCellFull(config);
        const init = { code, data };
        return new Kick((0, core_1.contractAddress)(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().endCell(),
        });
    }
    // Getters
    async getCollectState(provider) {
        const result = (await provider.get('get_collect_state', [])).stack;
        return {
            collected: result.readBigNumber(),
            target: result.readBigNumber()
        };
    }
    async getVoteState(provider) {
        const result = (await provider.get('get_vote_state', [])).stack;
        return {
            inProgress: result.readBigNumber() == 1n,
            voteNumber: result.readBigNumber(),
            voted: result.readBigNumber(),
            target: result.readBigNumber()
        };
    }
    async getExpiration(provider) {
        const result = (await provider.get('get_expiration', [])).stack;
        const expirationTimestamp = result.readBigNumber();
        return new Date(expirationTimestamp.toString());
    }
    async getBackerContract(provider, owner) {
        const result = (await provider.get('get_backer_contract', [{ type: "slice", cell: (0, core_1.beginCell)().storeAddress(owner).endCell() }])).stack;
        return result.readAddress();
    }
    async getTierData(provider) {
        const result = (await provider.get('get_tier_data', [])).stack.readCell().beginParse();
        const data = [];
        while (result.remainingBits != 0) {
            data.push({
                amount: BigInt(result.loadUint(16)),
                bought: BigInt(result.loadUint(16)),
                price: BigInt(result.loadUint(64))
            });
        }
        return data;
    }
    // Setters. 
    async sendResolve(provider, via, value, queryId) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().storeUint(1, 32).storeUint(queryId, 64).endCell()
        });
    }
    async sendStartVote(provider, via, value, queryId) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().storeUint(2, 32).storeUint(queryId, 64).endCell()
        });
    }
    // Setters. ONLY FOR TESTING
    async sendTransfer(provider, via, value, backer, levelId, amount, jettonAmount) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)()
                .storeUint(0x7362d09c, 32)
                .storeUint(0n, 64)
                .storeCoins(jettonAmount)
                .storeAddress(backer)
                .storeUint(levelId, 8)
                .storeUint(amount, 16)
                .endCell()
        });
    }
}
exports.Kick = Kick;
