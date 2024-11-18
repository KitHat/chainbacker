import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemCell, TupleItemSlice } from '@ton/core';
import { LevelBackingData } from './models';

export type BackerConfig = {
    owner: Address,
    kick: Address
};

export function backerConfigToCell(config: BackerConfig): Cell {
    return beginCell().storeUint(0, 8).storeUint(0, 64).storeAddress(config.kick).storeAddress(config.owner).storeRef(Cell.EMPTY).endCell();
}

export class Backer implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Backer(address);
    }

    static createFromConfig(config: BackerConfig, code: Cell, workchain = 0) {
        const data = backerConfigToCell(config);
        const init = { code, data };
        return new Backer(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    // Getters

    async getBackerData(provider: ContractProvider): Promise<[bigint, bigint, LevelBackingData[]]> {
        const result = (await provider.get('backer_data', [])).stack;
        const last = result.readBigNumber();
        const power = result.readBigNumber();
        const backData = (result.peek() as TupleItemCell).cell.asSlice();
        let backs = [];
        let i = 0n;
        while (backData.remainingBits != 0) {
            const backed = backData.loadUintBig(16);
            backs.push({ id: i, amount: backed });
            i += 1n;
        }
        return [last, power, backs];
    }

    // Setters. 

    async sendVote(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, voteNumber: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).storeUint(queryId, 64).storeUint(voteNumber, 8).endCell()
        })
    }

    async sendRefund(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(3, 32).storeUint(queryId, 64).endCell()
        })
    }

    // This one is intended ONLY FOR UNIT TESTS. Backer contract will never accept a mint transaction from anything but a kick contract

    async sendMint(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, levelId: bigint, amount: bigint, price: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(queryId, 64).storeUint(levelId, 8).storeUint(amount, 16).storeUint(price, 64).endCell()
        })
    }
}