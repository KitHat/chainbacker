import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
export type JettonWalletConfig = {};
export declare function jettonWalletConfigToCell(config: JettonWalletConfig): Cell;
export declare class JettonWallet implements Contract {
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    } | undefined;
    constructor(address: Address, init?: {
        code: Cell;
        data: Cell;
    } | undefined);
    static createFromAddress(address: Address): JettonWallet;
    static createFromConfig(config: JettonWalletConfig, code: Cell, workchain?: number): JettonWallet;
    sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void>;
    getJettonBalance(provider: ContractProvider): Promise<bigint>;
    static transferMessage(jetton_amount: bigint, to: Address, responseAddress: Address, customPayload: Cell | null, forward_ton_amount: bigint, forwardPayload: Cell): Cell;
    sendTransfer(provider: ContractProvider, via: Sender, value: bigint, jetton_amount: bigint, to: Address, responseAddress: Address, customPayload: Cell, forward_ton_amount: bigint, forwardPayload: Cell): Promise<void>;
    static burnMessage(jetton_amount: bigint, responseAddress: Address, customPayload: Cell | null): Cell;
    sendBurn(provider: ContractProvider, via: Sender, value: bigint, jetton_amount: bigint, responseAddress: Address, customPayload: Cell): Promise<void>;
    static withdrawTonsMessage(): Cell;
    sendWithdrawTons(provider: ContractProvider, via: Sender): Promise<void>;
    static withdrawJettonsMessage(from: Address, amount: bigint): Cell;
    sendWithdrawJettons(provider: ContractProvider, via: Sender, from: Address, amount: bigint): Promise<void>;
}
