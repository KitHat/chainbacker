import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemCell, TupleItemSlice } from '@ton/core';
import { CollectState, Milestone, Tier, VoteState } from './models';

export type KickConfig = {
    target: bigint,
    expiration: bigint,
    creator: Address,
    milestones: Milestone[],
    tiers: Tier[],
    code: Cell,
    usdtWallet: Address,
    comissionWallet: Address
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
        .storeUint(0, 1)
        .storeUint(0, 8)
        .storeUint(config.tiers.length, 8)
        .storeUint(1, 1)
        .storeAddress(config.creator)
        .storeRef(milestones.endCell())
        .storeRef(tiers.endCell())
        .storeRef(config.code)
        .storeRef(
            beginCell()
                .storeAddress(config.usdtWallet)
                .storeAddress(config.comissionWallet)
                .endCell()
        )
        .endCell();
}

// TEST-ONLY CONFIGS
export type KickConfigFull = {
    target: bigint,
    expiration: bigint,
    creator: Address,
    milestones: Milestone[],
    tiers: Tier[],
    code: Cell,
    collected: bigint,
    usdtWallet: Address,
    comissionWallet: Address
};

// TEST-ONLY CONFIGS
export function kickConfigToCellFull(config: KickConfigFull): Cell {
    let tiers = beginCell();
    for (const tier of config.tiers) {
        tiers = tiers.storeUint(tier.amount, 16).storeUint(0, 16).storeUint(tier.price, 64);
    }
    let milestones = beginCell();
    for (const milestone of config.milestones) {
        milestones = milestones.storeUint(milestone.part, 8);
    }
    return beginCell()
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
        .storeRef(
            beginCell()
                .storeAddress(config.usdtWallet)
                .storeAddress(config.comissionWallet)
                .endCell()
        )
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

    // TEST ONLY CONFIG
    static createFromConfigFull(config: KickConfigFull, code: Cell, workchain = 0) {
        const data = kickConfigToCellFull(config);
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

    async getBackerContract(provider: ContractProvider, owner: Address): Promise<Address> {
        const result = (await provider.get('get_backer_contract', [{ type: "slice", cell: beginCell().storeAddress(owner).endCell() }])).stack;
        return result.readAddress();
    }

    async getTierData(provider: ContractProvider): Promise<Tier[]> {
        const result = (await provider.get('get_tier_data', [])).stack.readCell().beginParse();
        const data = [];
        while (result.remainingBits != 0) {
            data.push({
                amount: BigInt(result.loadUint(16)),
                bought: BigInt(result.loadUint(16)),
                price: BigInt(result.loadUint(64))
            })
        }
        return data;
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

    // Setters. ONLY FOR TESTING
    async sendTransfer(provider: ContractProvider, via: Sender, value: bigint, backer: Address, levelId: bigint, amount: bigint, jettonAmount: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x7362d09c, 32)
                .storeUint(0n, 64)
                .storeCoins(jettonAmount)
                .storeAddress(backer)
                .storeUint(levelId, 8)
                .storeUint(amount, 16)
                .endCell()
        })
    }

}