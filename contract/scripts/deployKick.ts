import { Address, toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
import { KickFactory } from '../wrappers/KickFactory';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }

    let target = 100000000n;
    let expiration = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3);

    const kickFactory = provider.open(KickFactory.createFromAddress(Address.parse("EQBk2uXgGwdFWCZQ1j5WvuEVTIUSbD6vEtc9suHKpBZzhOji")));

    let kickAddress = await kickFactory.getKickContract(target, expiration, addr, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

    // that's our jetton for testing
    const usdtMaster = provider.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));

    const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);

    await kickFactory.sendKick(provider.sender(), toNano('0.1'), 999n, target, expiration, kickUsdtAddr, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

    const reputation = provider.open(Kick.createFromAddress(kickAddress));

    // TODO: send method
}