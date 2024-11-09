import { toNano } from '@ton/core';
import { Reputation } from '../wrappers/Reputation.js';
import { compile } from '@ton/blueprint';
export async function run(provider) {
    const reputation = provider.open(Reputation.createFromConfig({}, await compile('Reputation')));
    await reputation.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(reputation.address);
    // run methods on `reputation`
}
