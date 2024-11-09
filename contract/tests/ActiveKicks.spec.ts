import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { ActiveKicks } from '../wrappers/ActiveKicks';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('ActiveKicks', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('ActiveKicks');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let activeKicks: SandboxContract<ActiveKicks>;

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
