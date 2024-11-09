import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import crypto from 'crypto';

export type ReputationConfig = {};

export function reputationConfigToCell(config: ReputationConfig): Cell {
    return beginCell().endCell();
}

export class Reputation implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Reputation(address);
    }

    static createFromConfig(config: ReputationConfig, code: Cell, workchain = 0) {
        const data = reputationConfigToCell(config);
        const init = { code, data };
        return new Reputation(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendInit(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, valid: Address, update: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(queryId, 64).storeAddress(valid).storeAddress(update).endCell()
        })
    }

    async sendNewKick(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, target: bigint, kickEnd: bigint, title: string, timestamp: number, levels: [bigint, bigint][]) {
        let toHash = `${timestamp}${title}`;
        let marker = crypto.createHash('md5').update(toHash).digest().readBigUint64BE();
        let cell = beginCell().storeUint(2, 32).storeUint(queryId, 64).storeUint(target, 256).storeUint(marker, 256).storeUint(kickEnd, 64).storeUint(levels.length, 16);
        for (const level of levels) {
            cell = cell.storeUint(level[0], 256).storeUint(level[1], 16);
        }
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: cell.endCell()
        })
    }

    async sendIncreaseRep(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, toIncrease: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(3, 32).storeUint(queryId, 64).storeAddress(toIncrease).endCell()
        })
    }

    async getRepByAddress(provider: ContractProvider, address: Address): Promise<bigint> {
        const result = (await provider.get('get_rep', [{ type: 'slice', cell: beginCell().storeAddress(address).endCell() }])).stack;
        return result.readBigNumber();
    }
}
