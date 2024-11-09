import { beginCell, contractAddress, SendMode } from '@ton/core';
import crypto from 'crypto';
export function reputationConfigToCell(config) {
    return beginCell().endCell();
}
export class Reputation {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new Reputation(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = reputationConfigToCell(config);
        const init = { code, data };
        return new Reputation(contractAddress(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendInit(provider, via, value, queryId, valid, update) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(queryId, 64).storeAddress(valid).storeAddress(update).endCell()
        });
    }
    async sendNewKick(provider, via, value, queryId, target, kickEnd, title, timestamp, levels) {
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
        });
    }
    async sendIncreaseRep(provider, via, value, queryId, toIncrease) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(3, 32).storeUint(queryId, 64).storeAddress(toIncrease).endCell()
        });
    }
    async getRepByAddress(provider, address) {
        const result = (await provider.get('get_rep', [{ type: 'slice', cell: beginCell().storeAddress(address).endCell() }])).stack;
        return result.readBigNumber();
    }
}
