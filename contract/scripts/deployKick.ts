import { Address, toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let code = await compile("Backer");
    const kick = provider.open(Kick.createFromConfig({ target: 100000000n, expiration: BigInt(Date.now() + 60 * 60 * 24 * 3), creator: addr, milestones: [{ part: 100n }], tiers: [{ amount: 1000n, price: 100000n }], code }, await compile('Kick')));

    await kick.sendDeploy(provider.sender(), toNano('0.1'));

    await provider.waitForDeploy(kick.address);

    const kickAddress = kick.address;
    const reputation = provider.open(Kick.createFromAddress(kickAddress));

    const usdtMaster = provider.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));

    const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);

    let res = await reputation.sendUsdtWallet(provider.sender(), toNano('0.05'), 2n, kickUsdtAddr);

    // TODO: send method
}