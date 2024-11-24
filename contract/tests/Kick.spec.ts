import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, toNano, Cell } from '@ton/core';
import { Kick } from '../wrappers/Kick'; // Integration point 1: Import your Kick contract wrapper
import { Backer } from '../wrappers/Backer'; // Integration point 2: Import your Back contract wrapper
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter'; // Integration point 3: Import Jetton contracts
import { JettonWallet } from '../wrappers/JettonWallet';
import { compile } from '@ton/blueprint';

import '@ton/test-utils';
import exp from 'constants';
import { KickFactory } from '../wrappers/KickFactory';

describe('Crowdfunding System Tests', () => {
    let blockchain: Blockchain;
    let kick: SandboxContract<Kick>;
    let collectedKick: SandboxContract<Kick>;
    let back: SandboxContract<Backer>;
    let backer_1: SandboxContract<Backer>;
    let backer_2: SandboxContract<Backer>;
    let usdtMaster: SandboxContract<JettonMinter>;
    let usdtWallet: SandboxContract<JettonWallet>;
    let usdtWallet2: SandboxContract<JettonWallet>;
    let kickUsdtWallet: SandboxContract<JettonWallet>;
    let deployer: SandboxContract<TreasuryContract>;
    let creator: SandboxContract<TreasuryContract>;
    let backer: SandboxContract<TreasuryContract>;
    let backer2: SandboxContract<TreasuryContract>;

    let kickFactory: SandboxContract<KickFactory>;

    let jettonWalletCode: Cell;
    let jettonMasterCode: Cell;
    let backerCode: Cell;
    let kickCode: Cell;
    let kickFactoryCode: Cell;

    beforeAll(async () => {
        backerCode = await compile("Backer");
        kickCode = await compile("Kick");
        jettonWalletCode = await compile("JettonWallet");
        jettonMasterCode = await compile("JettonMinter");
        kickFactoryCode = await compile("KickFactory");
    });

    const COLLECTION_TARGET = toNano('1000');
    const KICK_DURATION = 60 * 60 * 24 * 30; // 30 days

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        creator = await blockchain.treasury('creator');
        backer = await blockchain.treasury('backer');
        backer2 = await blockchain.treasury('backer2');

        // Deploy Jetton Master (USDT)
        usdtMaster = blockchain.openContract(
            await JettonMinter.createFromConfig({
                admin: creator.address,
                content: jettonContentToCell({ type: 1, uri: 'https://usdt.ton/metadata.json' }),
                wallet_code: jettonWalletCode
            }, jettonMasterCode)
        );

        await usdtMaster.sendDeploy(deployer.getSender(), toNano("0.1"));

        kickFactory = blockchain.openContract(
            await KickFactory.createFromConfig({
                kickCode,
                backCode: backerCode
            }, kickFactoryCode)
        );

        await kickFactory.sendDeploy(deployer.getSender(), toNano('0.1'));
        let expiration = BigInt(Math.floor(Date.now() / 1000) + KICK_DURATION);

        await kickFactory.sendKick(
            creator.getSender(),
            toNano('0.1'),
            999n,
            COLLECTION_TARGET,
            expiration,
            1n,
            [{ part: 40n }, { part: 40n }, { part: 20n }],
            [
                {
                    price: 100n,
                    amount: 1000n
                }
            ]
        );

        let kickAddress = await kickFactory.getKickContract(COLLECTION_TARGET,
            expiration,
            1n,
            creator.address,
            [{ part: 40n }, { part: 40n }, { part: 20n }],
            [
                {
                    price: 100n,
                    amount: 1000n
                }
            ]
        );

        // Deploy Kick contract
        kick = blockchain.openContract(
            Kick.createFromAddress(kickAddress)
        );

        let backUsdtAddress = await usdtMaster.getWalletAddress(backer.address);
        let backUsdtAddress2 = await usdtMaster.getWalletAddress(backer2.address);
        // Mint some USDT to backer's wallet
        await mintJettons(backer.address, toNano('2000'));
        await mintJettons(backer2.address, toNano('2000'));

        // Deploy Jetton wallets
        usdtWallet = await deployJettonWallet(backUsdtAddress);
        usdtWallet2 = await deployJettonWallet(backUsdtAddress2);

        let kickUsdtWalletAddress = await usdtMaster.getWalletAddress(kick.address);
        kickUsdtWallet = await deployJettonWallet(kickUsdtWalletAddress);
        await kick.sendUsdtWallet(creator.getSender(), toNano("0.05"), 1n, kickUsdtWalletAddress);
    });

    describe('Kick Contract Tests', () => {
        describe('Back a kick', () => {
            it('should create new Back contract on first backing', async () => {
                const amount = 1n;
                const price = 100n;
                const levelId = 0n;

                // Verify Jetton balance
                const backBalancePre = await usdtWallet.getJettonBalance();
                expect(backBalancePre).not.toEqual(0);

                // Create transfer_notification message
                const forwardPayload = beginCell()
                    .storeUint(levelId, 8)
                    .storeUint(amount, 16)
                    .endCell();
                const tierDataPre = await kick.getTierData();

                // Send tokens from backer's USDT wallet to kick's USDT wallet
                let res = await usdtWallet.sendTransfer(backer.getSender(),
                    toNano("0.1"),
                    amount * price,
                    kick.address,
                    backer.address,
                    Cell.EMPTY,
                    toNano('0.05'),
                    forwardPayload
                );

                // Verify Jetton balance
                const backBalancePost = await usdtWallet.getJettonBalance();
                expect(backBalancePost).toEqual(backBalancePre - 100n);

                // Verify Back contract creation
                const backAddress = await kick.getBackerContract(backer.address);
                expect(backAddress).not.toBeNull();

                // Verify Jetton balance
                const kickBalance = await kickUsdtWallet.getJettonBalance();
                expect(kickBalance).toEqual(amount * price);

                // Verify collected amount
                const state = await kick.getCollectState();
                expect(state.collected).toEqual(amount * price);

                const backerAddress = await kick.getBackerContract(backer.address);
                const backerContract = blockchain.openContract(Backer.createFromAddress(backerAddress));
                const data = await backerContract.getBackerData();

                const tierData = await kick.getTierData();
            });

            it('should fail if sent not from USDT wallet', async () => {
                const amount = toNano('100');
                const levelId = 1n;
                let res = await kick.sendTransfer(backer.getSender(), toNano('0.05'), backer.address, 0n, 1n, 100n);

                // Try to send directly to kick contract
                await expect(
                    res.transactions
                ).toHaveTransaction(
                    {
                        from: backer.address,
                        to: kick.address,
                        success: false
                    }
                );
            });

            describe('Resolve kick with Jettons', () => {
                it('should distribute Jettons when milestone is reached', async () => {
                    let collectedKick = blockchain.openContract(
                        await Kick.createFromConfigFull({
                            creator: creator.address,
                            target: COLLECTION_TARGET,
                            collected: COLLECTION_TARGET + 100n,
                            expiration: BigInt(Math.floor(Date.now() / 1000) - 1000),
                            tiers: [
                                {
                                    price: 100n,
                                    amount: 1000n
                                }
                            ],
                            milestones: [{ part: 40n }, { part: 40n }, { part: 20n }],
                            code: backerCode,
                        }, kickCode)
                    );

                    await collectedKick.sendDeploy(creator.getSender(), toNano('0.05'));

                    const kickUsdtAddress = await usdtMaster.getWalletAddress(collectedKick.address);
                    await mintJettons(collectedKick.address, COLLECTION_TARGET + 100n);
                    await collectedKick.sendUsdtWallet(creator.getSender(), toNano('0.01'), 1n, kickUsdtAddress);

                    const creatorUsdtWalletAddress = await usdtMaster.getWalletAddress(creator.address);
                    const creatorUsdtWallet = await deployJettonWallet(creatorUsdtWalletAddress);

                    const initialBalance = await creatorUsdtWallet.getJettonBalance();

                    // Resolve kick
                    await collectedKick.sendResolve(creator.getSender(), toNano("0.05"), 2n);

                    // Verify Jetton distribution
                    const finalBalance = await creatorUsdtWallet.getJettonBalance();
                    expect(finalBalance).toBeGreaterThan(initialBalance);
                });
            });
        });

        describe('Vote for kick with Jettons', () => {
            it('should distribute Jettons when votes are passed', async () => {
                let collected = 1000n;
                let expiration = Math.floor(Date.now() / 1000) + 1000;
                collectedKick = blockchain.openContract(
                    await Kick.createFromConfig({
                        creator: creator.address,
                        target: collected,
                        expiration: BigInt(expiration),
                        tiers: [
                            {
                                price: 100n,
                                amount: 1000n
                            }
                        ],
                        milestones: [{ part: 40n }, { part: 40n }, { part: 20n }],
                        code: backerCode,
                    }, kickCode)
                );
                await collectedKick.sendDeploy(creator.getSender(), toNano('0.05'));
                const kickUsdtAddress = await usdtMaster.getWalletAddress(collectedKick.address);
                await collectedKick.sendUsdtWallet(creator.getSender(), toNano('0.01'), 1n, kickUsdtAddress);
                let power1 = 700n;
                let levelId = 0;
                let forwardPayload = beginCell()
                    .storeUint(levelId, 8)
                    .storeUint(7, 16)
                    .endCell();
                await usdtWallet.sendTransfer(
                    backer.getSender(),
                    toNano("0.1"),
                    power1,
                    collectedKick.address,
                    backer.address,
                    Cell.EMPTY,
                    toNano('0.05'),
                    forwardPayload
                );

                let power2 = 400n;
                forwardPayload = beginCell()
                    .storeUint(levelId, 8)
                    .storeUint(4, 16)
                    .endCell();
                await usdtWallet2.sendTransfer(
                    backer2.getSender(),
                    toNano("0.1"),
                    power2,
                    collectedKick.address,
                    backer.address,
                    Cell.EMPTY,
                    toNano('0.05'),
                    forwardPayload
                );

                let state = await collectedKick.getCollectState();
                expect(state.collected).toBe(power1 + power2);

                blockchain.now = expiration + 100;

                const creatorUsdtWalletAddress = await usdtMaster.getWalletAddress(creator.address);
                const creatorUsdtWallet = await deployJettonWallet(creatorUsdtWalletAddress);

                const initialBalance = await creatorUsdtWallet.getJettonBalance();

                // Resolve kick
                let res = await collectedKick.sendResolve(creator.getSender(), toNano("0.05"), 2n);

                // Verify Jetton distribution
                const finalBalance = await creatorUsdtWallet.getJettonBalance();
                expect(finalBalance).toBeGreaterThan(initialBalance);

                await collectedKick.sendStartVote(creator.getSender(), toNano('0.05'), 3n);

                let voteState = await collectedKick.getVoteState();
                expect(voteState.inProgress).toBe(true);
                expect(voteState.voteNumber).toBe(1n);
                expect(voteState.voted).toBe(0n);

                let backer1ContractAddress = await collectedKick.getBackerContract(backer.address);
                backer_1 = blockchain.openContract(Backer.createFromAddress(backer1ContractAddress));
                res = await backer_1.sendVote(backer.getSender(), toNano('0.01'), 4n, 1n);

                voteState = await collectedKick.getVoteState();
                expect(voteState.inProgress).toBe(true);
                expect(voteState.voteNumber).toBe(1n);
                expect(voteState.voted).toBe(power1);


                let backer2ContractAddress = await collectedKick.getBackerContract(backer2.address);
                backer_2 = blockchain.openContract(Backer.createFromAddress(backer2ContractAddress));
                res = await backer_2.sendVote(backer2.getSender(), toNano('0.01'), 5n, 1n);

                voteState = await collectedKick.getVoteState();
                expect(voteState.inProgress).toBe(false);
                expect(voteState.voteNumber).toBe(1n);
                expect(voteState.voted).toBe(1100n);

                const nextMilestoneBalance = await creatorUsdtWallet.getJettonBalance();
                expect(nextMilestoneBalance).toBeGreaterThan(finalBalance);
            });
        });

        describe('Refund for kick with Jettons', () => {
            it('should distribute Jettons when kick failed to collect', async () => {
                let collected = 1000n;
                let expiration = Math.floor(Date.now() / 1000) + 1000;
                collectedKick = blockchain.openContract(
                    await Kick.createFromConfig({
                        creator: creator.address,
                        target: collected,
                        expiration: BigInt(expiration),
                        tiers: [
                            {
                                price: 100n,
                                amount: 1000n
                            }
                        ],
                        milestones: [{ part: 40n }, { part: 40n }, { part: 20n }],
                        code: backerCode,
                    }, kickCode)
                );
                await collectedKick.sendDeploy(creator.getSender(), toNano('0.05'));
                const kickUsdtAddress = await usdtMaster.getWalletAddress(collectedKick.address);
                await collectedKick.sendUsdtWallet(creator.getSender(), toNano('0.01'), 1n, kickUsdtAddress);
                let power1 = 700n;
                let levelId = 0;
                const preBalance = await usdtWallet.getJettonBalance();
                let forwardPayload = beginCell()
                    .storeUint(levelId, 8)
                    .storeUint(7, 16)
                    .endCell();
                await usdtWallet.sendTransfer(
                    backer.getSender(),
                    toNano("0.1"),
                    power1,
                    collectedKick.address,
                    backer.address,
                    Cell.EMPTY,
                    toNano('0.05'),
                    forwardPayload
                );

                let state = await collectedKick.getCollectState();
                expect(state.collected).toBe(power1);

                blockchain.now = expiration + 100;

                const creatorUsdtWalletAddress = await usdtMaster.getWalletAddress(creator.address);
                const creatorUsdtWallet = await deployJettonWallet(creatorUsdtWalletAddress);

                const initialBalance = await usdtWallet.getJettonBalance();
                expect(preBalance).toBeGreaterThan(initialBalance);

                let backer1ContractAddress = await collectedKick.getBackerContract(backer.address);
                backer_1 = blockchain.openContract(Backer.createFromAddress(backer1ContractAddress));
                let res = await backer_1.sendRefund(backer.getSender(), toNano('0.05'), 4n);

                const resultBalance = await usdtWallet.getJettonBalance();

                expect(initialBalance).toBeLessThan(resultBalance);
                expect(preBalance).toBe(resultBalance);

            });
        });
    });

    // Helper functions
    async function deployJettonWallet(wallet: Address): Promise<SandboxContract<JettonWallet>> {
        const walletContract = blockchain.openContract(
            await JettonWallet.createFromAddress(wallet)
        );
        let res = await walletContract.sendDeploy(deployer.getSender(), toNano("0.05"));

        return walletContract;
    }

    async function mintJettons(to: Address, amount: bigint) {
        await usdtMaster.sendMint(creator.getSender(),
            to,
            amount,
            toNano('0.05'),
            toNano('0.1')
        );
    }

    async function backKickWithAmount(amount: bigint) {
        const forwardPayload = beginCell()
            .storeUint(0n, 8) // levelId
            .storeUint(10n, 16)
            .endCell();

        let res = await usdtWallet.sendTransfer(
            backer.getSender(),
            toNano('0.1'),
            amount,
            kick.address,
            backer.address,
            Cell.EMPTY,
            toNano('0.05'),
            forwardPayload
        );
    }
});