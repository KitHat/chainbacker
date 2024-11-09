import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Reputation } from '../wrappers/Reputation';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { randomAddress } from '@ton/test-utils';

describe('Reputation', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Reputation');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let next: SandboxContract<TreasuryContract>;
    let reputation: SandboxContract<Reputation>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        reputation = blockchain.openContract(Reputation.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');
        next = await blockchain.treasury('next');

        const deployResult = await reputation.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: reputation.address,
            deploy: true,
            success: true
        });

        const initResult = await reputation.sendInit(deployer.getSender(), toNano('0.01'), 123n, next.address, next.address);

        expect(initResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: reputation.address,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and reputation are ready to use
    });

    it('should increase rep', async () => {
        const address = randomAddress();
        let noRep = await reputation.getRepByAddress(address);
        expect(noRep).toEqual(0n);
        await reputation.sendIncreaseRep(next.getSender(), toNano('0.01'), 124n, address);

        let newRep = await reputation.getRepByAddress(address);
        expect(newRep).toEqual(1n);
        await reputation.sendIncreaseRep(next.getSender(), toNano('0.01'), 125n, address);

        newRep = await reputation.getRepByAddress(address);
        expect(newRep).toEqual(2n);
    })

    it('should pass valid request', async () => {
        let resp = await reputation.sendNewKick(deployer.getSender(), toNano('0.01'), 124n, 90000000000n);
        expect(resp.transactions).toHaveTransaction({
            from: deployer.address,
            to: reputation.address,
            success: true
        });

        expect(resp.transactions).toHaveTransaction({
            from: reputation.address,
            to: next.address,
            // TODO: check data that is sent to the next contract
        })
    })

    it('should fail invalid request', async () => {
        let resp = await reputation.sendNewKick(deployer.getSender(), toNano('0.01'), 124n, 200000000000n);
        expect(resp.transactions).toHaveTransaction({
            exitCode: 106
        });
    })
});
