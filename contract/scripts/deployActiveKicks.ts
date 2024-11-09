import { toNano } from '@ton/core';
import { ActiveKicks } from '../wrappers/ActiveKicks';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const activeKicks = provider.open(ActiveKicks.createFromConfig({}, await compile('ActiveKicks')));

    await activeKicks.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(activeKicks.address);

    // run methods on `activeKicks`
}
