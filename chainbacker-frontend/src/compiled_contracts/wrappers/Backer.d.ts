import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
import { LevelBackingData } from './models';
export type BackerConfig = {
    owner: Address;
    kick: Address;
};
export type BackerData = {
    lastVoted: bigint;
    power: bigint;
    backed: LevelBackingData[];
};
export declare function backerConfigToCell(config: BackerConfig): Cell;
export declare class Backer implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): Backer;
    static createFromConfig(config: BackerConfig, code: Cell, workchain?: number): Backer;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    getBackerData(provider: ContractProvider): Promise<BackerData>;
    sendVote(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, voteNumber: bigint): Promise<void>;
    sendRefund(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint): Promise<void>;
    sendMint(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, levelId: bigint, amount: bigint, price: bigint): Promise<void>;
}
