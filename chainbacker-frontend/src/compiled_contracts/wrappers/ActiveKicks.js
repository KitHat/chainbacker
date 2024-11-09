import { beginCell, contractAddress, SendMode } from '@ton/core';
export function activeKicksConfigToCell(config) {
    return beginCell().endCell();
}
export class ActiveKicks {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new ActiveKicks(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = activeKicksConfigToCell(config);
        const init = { code, data };
        return new ActiveKicks(contractAddress(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
