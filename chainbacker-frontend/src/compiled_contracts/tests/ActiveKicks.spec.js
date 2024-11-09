import { Blockchain } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { ActiveKicks } from '../wrappers/ActiveKicks';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
describe('ActiveKicks', () => {
    let code;
    beforeAll(async () => {
        code = await compile('ActiveKicks');
    });
    let blockchain;
    let deployer;
    let activeKicks;
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        activeKicks = blockchain.openContract(ActiveKicks.createFromConfig({}, code));
        deployer = await blockchain.treasury('deployer');
        const deployResult = await activeKicks.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: activeKicks.address,
            deploy: true,
            success: true,
        });
    });
    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and activeKicks are ready to use
    });
});
