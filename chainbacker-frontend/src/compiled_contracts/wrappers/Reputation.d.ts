import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
export type ReputationConfig = {};
export declare function reputationConfigToCell(config: ReputationConfig): Cell;
export declare class Reputation implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): Reputation;
    static createFromConfig(config: ReputationConfig, code: Cell, workchain?: number): Reputation;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    sendInit(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, valid: Address, update: Address): Promise<void>;
    sendNewKick(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, target: bigint, kickEnd: bigint, levels: [bigint, bigint][]): Promise<void>;
    sendIncreaseRep(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, toIncrease: Address): Promise<void>;
    getRepByAddress(provider: ContractProvider, address: Address): Promise<bigint>;
}
