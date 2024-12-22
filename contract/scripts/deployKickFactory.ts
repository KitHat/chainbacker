import { Address, toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';
import { KickFactory } from '../wrappers/KickFactory';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let backCode = await compile("Backer");
    let kickCode = await compile("Kick");
    const kickFactory = provider.open(KickFactory.createFromConfig({ kickCode, backCode, comissionWallet: addr }, await compile('KickFactory')));

    await kickFactory.sendDeploy(provider.sender(), toNano('0.1'));

    await provider.waitForDeploy(kickFactory.address);

    // TODO: send method
}