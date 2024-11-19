"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sandbox_1 = require("@ton/sandbox");
const core_1 = require("@ton/core");
require("@ton/test-utils");
const blueprint_1 = require("@ton/blueprint");
const Backer_1 = require("../wrappers/Backer");
describe('Backer', () => {
    let code;
    beforeAll(async () => {
        code = await (0, blueprint_1.compile)('Backer');
    });
    let blockchain;
    let deployer;
    let owner; // TODO: this may become a 
    let backer;
    beforeEach(async () => {
        blockchain = await sandbox_1.Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        owner = await blockchain.treasury('owner');
        backer = blockchain.openContract(Backer_1.Backer.createFromConfig({
            kick: deployer.address,
            owner: owner.address
        }, code));
        const deployResult = await backer.sendDeploy(deployer.getSender(), (0, core_1.toNano)('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: backer.address,
            deploy: true,
            success: true
        });
    });
    it('mint', async () => {
        let res = await backer.sendMint(deployer.getSender(), (0, core_1.toNano)('0.01'), 1n, 2n, 2n, 1000n);
        // console.log(res);
        let data = await backer.getBackerData();
        expect(data.power).toEqual(1000n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 0n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });
        await backer.sendMint(deployer.getSender(), (0, core_1.toNano)('0.01'), 2n, 1n, 3n, 600n);
        data = await backer.getBackerData();
        expect(data.power).toEqual(1600n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 3n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });
        await backer.sendMint(deployer.getSender(), (0, core_1.toNano)('0.01'), 3n, 5n, 1n, 2000n);
        data = await backer.getBackerData();
        expect(data.power).toEqual(3600n);
        expect(data.backed[0]).toEqual({ id: 0n, amount: 0n });
        expect(data.backed[1]).toEqual({ id: 1n, amount: 3n });
        expect(data.backed[2]).toEqual({ id: 2n, amount: 2n });
        expect(data.backed[3]).toEqual({ id: 3n, amount: 0n });
        expect(data.backed[4]).toEqual({ id: 4n, amount: 0n });
        expect(data.backed[5]).toEqual({ id: 5n, amount: 1n });
        await backer.sendMint(deployer.getSender(), (0, core_1.toNano)('0.01'), 4n, 0n, 1n, 100n);
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
