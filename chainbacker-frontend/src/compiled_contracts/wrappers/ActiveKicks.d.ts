import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
export type ActiveKicksConfig = {};
export declare function activeKicksConfigToCell(config: ActiveKicksConfig): Cell;
export declare class ActiveKicks implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): ActiveKicks;
    static createFromConfig(config: ActiveKicksConfig, code: Cell, workchain?: number): ActiveKicks;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
}
