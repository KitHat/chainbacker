import { Address, Cell, beginCell, toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { JettonWallet } from '../wrappers/JettonWallet';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    // let code = await compile("Backer");
    // const kick = provider.open(Kick.createFromConfig({ target: 100000000n, expiration: BigInt(Date.now() + 60 * 60 * 24 * 3), creator: addr, milestones: [{ part: 100n }], tiers: [{ amount: 1000n, price: 100000n }], code }, await compile('Kick')));

    const usdtMaster = provider.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));
    const kickAddress = Address.parse("EQCLlnXz4uk1gts4ty7PP6Teh04JaprRDixwsK4lnSvjxr2C");

    // const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);
    const myUsdtAddr = await usdtMaster.getWalletAddress(addr);

    const myWallet = provider.open(JettonWallet.createFromAddress(myUsdtAddr));
    const forwardPayload = beginCell()
        .storeUint(0, 8)
        .storeUint(1, 16)
        .endCell();
    await myWallet.sendTransfer(provider.sender(), toNano('0.1'), 100000n, kickAddress, addr, Cell.EMPTY, toNano('0.05'), forwardPayload);

    // let res = await reputation.sendUsdtWallet(provider.sender(), toNano('0.05'), 2n, kickUsdtAddr);

    // TODO: send method
}