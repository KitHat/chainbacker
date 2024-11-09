import { toNano } from '@ton/core';
import { ActiveKicks } from '../wrappers/ActiveKicks.js';
import { compile } from '@ton/blueprint';
export async function run(provider) {
    const activeKicks = provider.open(ActiveKicks.createFromConfig({}, await compile('ActiveKicks')));
    await activeKicks.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(activeKicks.address);
    // run methods on `activeKicks`
}
