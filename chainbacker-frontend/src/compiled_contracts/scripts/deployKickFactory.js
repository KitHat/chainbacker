import { toNano } from '@ton/core';
import { compile } from '@ton/blueprint';
import { KickFactory } from '../wrappers/KickFactory';
export async function run(provider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let backCode = await compile("Backer");
    let kickCode = await compile("Kick");
    const kickFactory = provider.open(KickFactory.createFromConfig({ kickCode, backCode }, await compile('KickFactory')));
    await kickFactory.sendDeploy(provider.sender(), toNano('0.1'));
    await provider.waitForDeploy(kickFactory.address);
    // TODO: send method
}
