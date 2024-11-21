import { Address, toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    const kickAddress = Address.parse("EQD_PhuKItHXw3JCp8BOP6u5zUOQ0qBRAZuR61IRZOr49JY2");
    const reputation = provider.open(Kick.createFromAddress(kickAddress));

    const usdtMaster = provider.open(JettonMinter.createFromAddress(Address.parse("kQD0GKBM8ZbryVk2aESmzfU6b9b_8era_IkvBSELujFZPsyy")));

    const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);

    let res = await reputation.sendUsdtWallet(provider.sender(), toNano('0.05'), 2n, kickUsdtAddr);

    // TODO: send method
}