import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemCell, TupleItemSlice } from '@ton/core';
import { CollectState, Milestone, Tier, VoteState } from './models';

export type KickConfig = {
    target: bigint,
    expiration: bigint,
    creator: Address,
    wallet: Address,
    milestones: Milestone[],
    tiers: Tier[]
    code: Cell
};

export function kickConfigToCell(config: KickConfig): Cell {
    let tiers = beginCell();
    for (const tier of config.tiers) {
        tiers = tiers.storeUint(tier.amount, 16).storeUint(0, 16).storeUint(tier.price, 64);
    }
    let milestones = beginCell();
    for (const milestone of config.milestones) {
        milestones = milestones.storeUint(milestone.part, 8);
    }
    return beginCell()
        .storeUint(0, 64)
        .storeUint(config.target, 64)
        .storeUint(config.expiration, 64)
        .storeUint(0, 64)
        .storeUint(0, 64)
        .storeUint(0, 64)
        .storeUint(0, 64)
        .storeAddress(config.creator)
        .storeAddress(config.wallet)
        .storeRef(milestones.endCell())
        .storeRef(tiers.endCell())
        .storeRef(config.code)
        .endCell();
}

export class Kick implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Kick(address);
    }

    static createFromConfig(config: KickConfig, code: Cell, workchain = 0) {
        const data = kickConfigToCell(config);
        const init = { code, data };
        return new Kick(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    // Getters

    async getCollectState(provider: ContractProvider): Promise<CollectState> {
        const result = (await provider.get('get_collect_state', [])).stack;
        return {
            collected: result.readBigNumber(),
            target: result.readBigNumber()
        };
    }

    async getVoteState(provider: ContractProvider): Promise<VoteState> {
        const result = (await provider.get('get_vote_state', [])).stack;
        return {
            inProgress: result.readBigNumber() == 1n,
            voteNumber: result.readBigNumber(),
            voted: result.readBigNumber(),
            target: result.readBigNumber()
        };
    }

    async getExpiration(provider: ContractProvider): Promise<Date> {
        const result = (await provider.get('get_expiration', [])).stack;
        const expirationTimestamp = result.readBigNumber();
        return new Date(expirationTimestamp.toString());
    }

    async getBackerContract(provider: ContractProvider, owner: Address): Promise<Date> {
        const result = (await provider.get('get_backer_contract', [{ type: "slice", cell: beginCell().storeAddress(owner).endCell() }])).stack;
        const expirationTimestamp = result.readBigNumber();
        return new Date(expirationTimestamp.toString());
    }

    // Setters. 
    async sendResolve(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(queryId, 64).endCell()
        })
    }

    async sendStartVote(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).storeUint(queryId, 64).endCell()
        })
    }

    async sendUsdtWallet(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, creator: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(5, 32).storeUint(queryId, 64).storeAddress(creator).endCell()
        })
    }

}