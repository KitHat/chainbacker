import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type ActiveKicksConfig = {};

export function activeKicksConfigToCell(config: ActiveKicksConfig): Cell {
    return beginCell().endCell();
}

export class ActiveKicks implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new ActiveKicks(address);
    }

    static createFromConfig(config: ActiveKicksConfig, code: Cell, workchain = 0) {
        const data = activeKicksConfigToCell(config);
        const init = { code, data };
        return new ActiveKicks(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
