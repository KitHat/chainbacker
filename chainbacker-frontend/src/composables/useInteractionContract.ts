import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";
import { TRANSACTION_GAS_PRICE } from "@/constants/blockchainMoks.ts";

export default class KickContract implements Contract {
    static createForDeploy(code: Cell, initialCounterValue: number): KickContract {
        const data = beginCell()
            .storeUint(initialCounterValue, 64)
            .endCell();

        const workchain = 0;

        const address = contractAddress(workchain, { code, data });

        return new KickContract(address, { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: TRANSACTION_GAS_PRICE.toString(),
            bounce: false
        });
    }

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
}
