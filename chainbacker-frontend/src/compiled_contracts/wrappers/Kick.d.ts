import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
import { CollectState, Milestone, Tier, VoteState } from './models';
export type KickConfig = {
    target: bigint;
    expiration: bigint;
    creator: Address;
    milestones: Milestone[];
    tiers: Tier[];
    code: Cell;
    usdtWallet: Address;
    comissionWallet: Address;
};
export declare function kickConfigToCell(config: KickConfig): Cell;
export type KickConfigFull = {
    target: bigint;
    expiration: bigint;
    creator: Address;
    milestones: Milestone[];
    tiers: Tier[];
    code: Cell;
    collected: bigint;
    usdtWallet: Address;
    comissionWallet: Address;
};
export declare function kickConfigToCellFull(config: KickConfigFull): Cell;
export declare class Kick implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): Kick;
    static createFromConfig(config: KickConfig, code: Cell, workchain?: number): Kick;
    static createFromConfigFull(config: KickConfigFull, code: Cell, workchain?: number): Kick;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    getCollectState(provider: ContractProvider): Promise<CollectState>;
    getVoteState(provider: ContractProvider): Promise<VoteState>;
    getExpiration(provider: ContractProvider): Promise<Date>;
    getBackerContract(provider: ContractProvider, owner: Address): Promise<Address>;
    getTierData(provider: ContractProvider): Promise<Tier[]>;
    sendResolve(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint): Promise<void>;
    sendStartVote(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint): Promise<void>;
    sendTransfer(provider: ContractProvider, via: Sender, value: bigint, backer: Address, levelId: bigint, amount: bigint, jettonAmount: bigint): Promise<void>;
}
