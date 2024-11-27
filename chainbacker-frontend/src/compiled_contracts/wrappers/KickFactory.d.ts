import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
import { Milestone, Tier } from './models';
export type KickFactoryConfig = {
    kickCode: Cell;
    backCode: Cell;
};
export declare function kickFactoryConfigToCell(config: KickFactoryConfig): Cell;
export declare class KickFactory implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): KickFactory;
    static createFromConfig(config: KickFactoryConfig, code: Cell, workchain?: number): KickFactory;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    getKickContract(provider: ContractProvider, target: bigint, expiration: bigint, tier_number: bigint, creator: Address, milestones: Milestone[], tiers: Tier[]): Promise<Address>;
    sendKick(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, target: bigint, expiration: bigint, tier_number: bigint, milestones: Milestone[], tiers: Tier[]): Promise<void>;
}
