"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sandbox_1 = require("@ton/sandbox");
const core_1 = require("@ton/core");
const Kick_1 = require("../wrappers/Kick"); // Integration point 1: Import your Kick contract wrapper
const JettonMinter_1 = require("../wrappers/JettonMinter"); // Integration point 3: Import Jetton contracts
const JettonWallet_1 = require("../wrappers/JettonWallet");
const blueprint_1 = require("@ton/blueprint");
require("@ton/test-utils");
describe('Crowdfunding System Tests', () => {
    let blockchain;
    let kick;
    let back;
    let usdtMaster;
    let usdtWallet;
    let kickUsdtWallet;
    let deployer;
    let creator;
    let backer;
    let jettonWalletCode;
    let jettonMasterCode;
    let backerCode;
    let kickCode;
    beforeAll(async () => {
        backerCode = await (0, blueprint_1.compile)("Backer");
        kickCode = await (0, blueprint_1.compile)("Kick");
        jettonWalletCode = await (0, blueprint_1.compile)("JettonWallet");
        jettonMasterCode = await (0, blueprint_1.compile)("JettonMinter");
    });
    const COLLECTION_TARGET = (0, core_1.toNano)('1000');
    const KICK_DURATION = 60 * 60 * 24 * 30; // 30 days
    beforeEach(async () => {
        blockchain = await sandbox_1.Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        creator = await blockchain.treasury('creator');
        backer = await blockchain.treasury('backer');
        // Deploy Jetton Master (USDT)
        usdtMaster = blockchain.openContract(await JettonMinter_1.JettonMinter.createFromConfig({
            admin: creator.address,
            content: (0, JettonMinter_1.jettonContentToCell)({ type: 1, uri: 'https://usdt.ton/metadata.json' }),
            wallet_code: jettonWalletCode
        }, jettonMasterCode));
        await usdtMaster.sendDeploy(deployer.getSender(), (0, core_1.toNano)("0.1"));
        // Deploy Kick contract
        kick = blockchain.openContract(await Kick_1.Kick.createFromConfig({
            creator: creator.address,
            target: COLLECTION_TARGET,
            expiration: BigInt(Date.now() + KICK_DURATION),
            tiers: [
                {
                    price: 100n,
                    amount: 1000n
                }
            ],
            milestones: [{ part: 40n }, { part: 40n }, { part: 20n }],
            code: backerCode,
        }, kickCode));
        await kick.sendDeploy(deployer.getSender(), (0, core_1.toNano)("0.1"));
        let backUsdtAddress = await usdtMaster.getWalletAddress(backer.address);
        // Mint some USDT to backer's wallet
        await mintJettons(backer.address, (0, core_1.toNano)('2000'));
        // Deploy Jetton wallets
        usdtWallet = await deployJettonWallet(backUsdtAddress);
        let kickUsdtWalletAddress = await usdtMaster.getWalletAddress(kick.address);
        kickUsdtWallet = await deployJettonWallet(kickUsdtWalletAddress);
        await kick.sendUsdtWallet(creator.getSender(), (0, core_1.toNano)("0.05"), 1n, kickUsdtWalletAddress);
    });
    describe('Kick Contract Tests', () => {
        // describe('Back a kick', () => {
        //     it('should create new Back contract on first backing', async () => {
        //         const amount = 1n;
        //         const price = 100n;
        //         const levelId = 0n;
        //         // Verify Jetton balance
        //         const backBalancePre = await usdtWallet.getJettonBalance();
        //         expect(backBalancePre).not.toEqual(0);
        //         // Create transfer_notification message
        //         const forwardPayload = beginCell()
        //             .storeUint(levelId, 8)
        //             .storeUint(amount, 16)
        //             .endCell();
        //         const tierDataPre = await kick.getTierData();
        //         console.log("cccc");
        //         console.log(tierDataPre);
        //         // Send tokens from backer's USDT wallet to kick's USDT wallet
        //         let res = await usdtWallet.sendTransfer(backer.getSender(),
        //             toNano("0.1"),
        //             amount * price,
        //             kick.address,
        //             backer.address,
        //             Cell.EMPTY,
        //             toNano('0.05'),
        //             forwardPayload
        //         );
        //         // console.log(res);
        //         // Verify Jetton balance
        //         const backBalancePost = await usdtWallet.getJettonBalance();
        //         expect(backBalancePost).toEqual(backBalancePre - 100n);
        //         // Verify Back contract creation
        //         const backAddress = await kick.getBackerContract(backer.address);
        //         expect(backAddress).not.toBeNull();
        //         // Verify Jetton balance
        //         const kickBalance = await kickUsdtWallet.getJettonBalance();
        //         expect(kickBalance).toEqual(amount * price);
        //         // Verify collected amount
        //         const state = await kick.getCollectState();
        //         expect(state.collected).toEqual(amount * price);
        //         const backerAddress = await kick.getBackerContract(backer.address);
        //         const backerContract = blockchain.openContract(Backer.createFromAddress(backerAddress));
        //         const data = await backerContract.getBackerData();
        //         console.log("dddd");
        //         console.log(data);
        //         const tierData = await kick.getTierData();
        //         console.log("cccc");
        //         console.log(tierData);
        //     });
        //     it('should fail if sent not from USDT wallet', async () => {
        //         const amount = toNano('100');
        //         const levelId = 1n;
        //         let res = await kick.sendTransfer(backer.getSender(), toNano('0.05'), backer.address, 0n, 1n, 100n);
        //         // Try to send directly to kick contract
        //         await expect(
        //             res.transactions
        //         ).toHaveTransaction(
        //             {
        //                 from: backer.address,
        //                 to: kick.address,
        //                 success: false
        //             }
        //         );
        //     });
        // });
        describe('Resolve kick with Jettons', () => {
            it('should distribute Jettons when milestone is reached', async () => {
                const creatorUsdtWalletAddress = await usdtMaster.getWalletAddress(creator.address);
                const creatorUsdtWallet = await deployJettonWallet(creatorUsdtWalletAddress);
                // Back the kick with full amount
                await backKickWithAmount(COLLECTION_TARGET);
                // Fast forward time
                let snapshot = blockchain.snapshot();
                let time = blockchain.now ?? Date.now();
                snapshot.time = time + KICK_DURATION + 1;
                await blockchain.loadFrom(snapshot);
                const initialBalance = await creatorUsdtWallet.getJettonBalance();
                // Resolve kick
                let res = await kick.sendResolve(creator.getSender(), (0, core_1.toNano)("0.05"), 111n);
                console.log(res.transactions);
                // Verify Jetton distribution
                const finalBalance = await creatorUsdtWallet.getJettonBalance();
                expect(finalBalance).toBeGreaterThan(initialBalance);
            });
        });
    });
    // Helper functions
    async function deployJettonWallet(wallet) {
        const walletContract = blockchain.openContract(await JettonWallet_1.JettonWallet.createFromAddress(wallet));
        let res = await walletContract.sendDeploy(deployer.getSender(), (0, core_1.toNano)("0.05"));
        // console.log(rxes);
        return walletContract;
    }
    async function mintJettons(to, amount) {
        let res = await usdtMaster.sendMint(creator.getSender(), to, amount, (0, core_1.toNano)('0.05'), (0, core_1.toNano)('0.1'));
    }
    async function backKickWithAmount(amount) {
        const forwardPayload = (0, core_1.beginCell)()
            .storeUint(0n, 8) // levelId
            .storeUint(10n, 16)
            .endCell();
        let res = await usdtWallet.sendTransfer(backer.getSender(), (0, core_1.toNano)('0.1'), amount, kick.address, backer.address, core_1.Cell.EMPTY, (0, core_1.toNano)('0.05'), forwardPayload);
        // console.log("222");
        // console.log(res.transactions);
    }
});
