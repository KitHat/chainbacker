"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backer = void 0;
exports.backerConfigToCell = backerConfigToCell;
const core_1 = require("@ton/core");
function backerConfigToCell(config) {
    return (0, core_1.beginCell)().storeUint(0, 8).storeUint(0, 64).storeAddress(config.kick).storeAddress(config.owner).storeRef(core_1.Cell.EMPTY).endCell();
}
class Backer {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    static createFromAddress(address) {
        return new Backer(address);
    }
    static createFromConfig(config, code, workchain = 0) {
        const data = backerConfigToCell(config);
        const init = { code, data };
        return new Backer((0, core_1.contractAddress)(workchain, init), init);
    }
    async sendDeploy(provider, via, value) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().endCell(),
        });
    }
    // Getters
    async getBackerData(provider) {
        const result = (await provider.get('backer_data', [])).stack;
        const last = result.readBigNumber();
        const power = result.readBigNumber();
        const backData = result.peek().cell.asSlice();
        let backs = [];
        let i = 0n;
        while (backData.remainingBits != 0) {
            const backed = backData.loadUintBig(16);
            backs.push({ id: i, amount: backed });
            i += 1n;
        }
        return {
            lastVoted: last,
            power,
            backed: backs
        };
    }
    // Setters. 
    async sendVote(provider, via, value, queryId, voteNumber) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().storeUint(2, 32).storeUint(queryId, 64).storeUint(voteNumber, 8).endCell()
        });
    }
    async sendRefund(provider, via, value, queryId) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().storeUint(3, 32).storeUint(queryId, 64).endCell()
        });
    }
    // This one is intended ONLY FOR UNIT TESTS. Backer contract will never accept a mint transaction from anything but a kick contract
    async sendMint(provider, via, value, queryId, levelId, amount, price) {
        await provider.internal(via, {
            value,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)().storeUint(1, 32).storeUint(queryId, 64).storeUint(levelId, 8).storeUint(amount, 16).storeUint(price, 64).endCell()
        });
    }
}
exports.Backer = Backer;
