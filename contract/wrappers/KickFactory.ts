import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemCell, TupleItemSlice } from '@ton/core';
import { CollectState, Milestone, Tier, VoteState } from './models';

export type KickFactoryConfig = {
    kickCode: Cell,
    backCode: Cell
};

export function kickFactoryConfigToCell(config: KickFactoryConfig): Cell {
    return beginCell()
        .storeRef(config.kickCode)
        .storeRef(config.backCode)
        .endCell();
}

export class KickFactory implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new KickFactory(address);
    }

    static createFromConfig(config: KickFactoryConfig, code: Cell, workchain = 0) {
        const data = kickFactoryConfigToCell(config);
        const init = { code, data };
        return new KickFactory(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    // Getters
    async getKickContract(provider: ContractProvider, target: bigint, expiration: bigint, tier_number: bigint, creator: Address, milestones: Milestone[], tiers: Tier[]): Promise<Address> {
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
    async sendKick(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, target: bigint, expiration: bigint, tier_number: bigint, milestones: Milestone[], tiers: Tier[]) {
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
        })
    }

}