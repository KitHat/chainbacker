import { toNano } from '@ton/core';
import { Kick } from '../wrappers/Kick';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let addr = provider.sender().address;
    if (!addr) {
        throw (123);
    }
    let code = await compile("Backer");
    const reputation = provider.open(Kick.createFromConfig({ target: 100000000n, expiration: BigInt(Date.now() + 60 * 60 * 24 * 3), creator: addr, milestones: [{ part: 100n }], tiers: [{ amount: 1000n, price: 100000n }], code }, await compile('Kick')));

    await reputation.sendDeploy(provider.sender(), toNano('0.1'));

    await provider.waitForDeploy(reputation.address);

    // TODO: send method
}