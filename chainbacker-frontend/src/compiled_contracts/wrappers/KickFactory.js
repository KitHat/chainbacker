import { beginCell, contractAddress, SendMode } from '@ton/core';
export function kickFactoryConfigToCell(config) {
    return beginCell()
        .storeRef(config.kickCode)
        .storeRef(config.backCode)
        .endCell();
}
export class KickFactory {
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
        return new KickFactory(contractAddress(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    // Getters
    async getKickContract(provider, target, expiration, tier_number, creator, milestones, tiers) {
        let milestoneCell = beginCell();
        for (const m of milestones) {
            milestoneCell = milestoneCell.storeUint(m.part, 8);
        }
        let tierCell = beginCell();
        for (const t of tiers) {
            tierCell = tierCell.storeUint(t.amount, 16).storeUint(0, 16).storeUint(t.price, 64);
        }
        const result = (await provider.get('get_kick_address', [
            { type: "int", value: target },
            { type: "int", value: expiration },
            { type: "int", value: tier_number },
            { type: "slice", cell: beginCell().storeAddress(creator).endCell() },
            { type: "cell", cell: milestoneCell.endCell() },
            { type: "cell", cell: tierCell.endCell() },
        ])).stack;
        return result.readAddress();
    }
    // Setters. 
    async sendKick(provider, via, value, queryId, target, expiration, tier_number, milestones, tiers) {
        let milestoneCell = beginCell();
        for (const m of milestones) {
            milestoneCell = milestoneCell.storeUint(m.part, 8);
        }
        let tierCell = beginCell();
        for (const t of tiers) {
            tierCell = tierCell.storeUint(t.amount, 16).storeUint(0, 16).storeUint(t.price, 64);
        }
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(queryId, 64).storeUint(target, 64).storeUint(expiration, 64).storeUint(tier_number, 8).storeRef(milestoneCell.endCell()).storeRef(tierCell.endCell()).endCell()
        });
    }
}
