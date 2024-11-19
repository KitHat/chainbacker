import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { Backer, } from '../wrappers/Backer';

describe('Backer', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Backer');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let owner: SandboxContract<TreasuryContract>; // TODO: this may become a 
    let backer: SandboxContract<Backer>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        owner = await blockchain.treasury('owner');

        backer = blockchain.openContract(Backer.createFromConfig({
            kick: deployer.address,
            owner: owner.address
        }, code));

        const deployResult = await backer.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: backer.address,
            deploy: true,
            success: true
        });
    });

    it('mint', async () => {
        let res = await backer.sendMint(deployer.getSender(), toNano('0.01'), 1n, 2n, 2n, 1000n);
        // console.log(res);
        let data = await backer.getBackerData();
        expect(data.power).toEqual(1000n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 0n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });


        await backer.sendMint(deployer.getSender(), toNano('0.01'), 2n, 1n, 3n, 600n);
        data = await backer.getBackerData();
        expect(data.power).toEqual(1600n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 3n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });


        await backer.sendMint(deployer.getSender(), toNano('0.01'), 3n, 5n, 1n, 2000n);
        data = await backer.getBackerData();
        expect(data.power).toEqual(3600n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 3n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });
        expect(data.backed[3]).toEqual({ id: 3n, amount: 0n });
        expect(data.backed[4]).toEqual({ id: 4n, amount: 0n });
        expect(data.backed[5]).toEqual({ id: 5n, amount: 1n });

        await backer.sendMint(deployer.getSender(), toNano('0.01'), 4n, 0n, 1n, 100n);
        data = await backer.getBackerData();
        expect(data.power).toEqual(3700n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 1n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 3n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });
        expect(data.backed[3]).toEqual({ id: 3n, amount: 0n });
        expect(data.backed[4]).toEqual({ id: 4n, amount: 0n });
        expect(data.backed[5]).toEqual({ id: 5n, amount: 1n });
    });

    // TODO: write a contract for kick and test them together
    // it('vote', async () => {
    //     await backer.sendMint(deployer.getSender(), toNano('0.01'), 1n, 2n, 2n, 1000n);
    //     // console.log(res);
    //     let resVote1 = await backer.sendVote(deployer.getSender(), toNano('0.01'), 2n, 1n);
    //     // TODO: check data
    //     expect(resVote1.transactions).toHaveTransaction({
    //         from: backer.address,
    //         to: deployer.address,
    //         success: true
    //     });
    //     let resVoteAgain = await backer.sendVote(deployer.getSender(), toNano('0.01'), 3n, 1n);
    //     // console.log(resVoteAgain);
    // });
});
