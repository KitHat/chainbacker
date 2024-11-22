import { Tier } from "../models/tier";
import { BackRepository } from "../repositories/back.repository";
import { ContractRepository } from "../repositories/contract.repository";
import { KickRepository, KickUpdateDto } from "../repositories/kick.repository";
import { TonClient, Address } from '@ton/ton';

interface ContractQueryOptions {
    limit: number,
    hash?: string,
    lt?: string
}

export class KickProcessor {
    private contractAddress: string;
    private client: TonClient;
    private kickRepository: KickRepository;
    private backRepository: BackRepository;
    private contractRepository: ContractRepository;
    constructor(kickRepository: KickRepository, contractRepository: ContractRepository, backRepository: BackRepository, contractAddress: string, tonConnString: string) {
        this.contractAddress = contractAddress;
        this.client = new TonClient({
            endpoint: tonConnString
        });
        this.kickRepository = kickRepository;
        this.contractRepository = contractRepository;
        this.backRepository = backRepository;
    }

    async run() {
        let contractData = await this.contractRepository.getContractData(this.contractAddress);
        let options: ContractQueryOptions = {
            limit: 100
        };
        if (contractData) {
            options.hash = contractData.lastParsedHash;
            options.lt = contractData.lastLt;
        }

        let txs = await this.client.getTransactions(Address.parse(this.contractAddress), options);
        for (const tx of txs) {
            let desc = tx.description
            if (desc.type !== "generic") {
                console.log("no generic");
                continue;
            }
            let phase = desc.computePhase;
            if (phase.type !== "vm") {
                console.log(`Skipped ${tx.hash().toString()}`);
                continue;
            }
            if (phase.exitCode != 0) {
                continue;
            }
            let msg = tx.inMessage;
            if (!msg) {
                console.log("no in msg");
                continue;
            }
            let body = msg.body.beginParse();
            let op = body.loadUint(32);
            let sender = msg.info.src?.toString();
            if (!sender) {
                console.log("no sender");
                continue;
            }
            let kick = await this.kickRepository.getKickByAddress(this.contractAddress);
            if (!kick) {
                console.log("no kick found 2");
                continue;
            }
            if (op == 0x7362d09c) {
                let received = body.loadCoins();
                let backer = body.loadAddress();
                let level = body.loadUint(8);
                let amount = body.loadUint(16);

                for (const msg of tx.outMessages) {
                    // there should be a single message, but we will check its body no matter what
                    let body = msg[1].body.beginParse();
                    let op = body.loadUint(32);
                    if (op !== 1) {
                        console.log("wrong message");
                        continue;
                    }
                    let back = msg[1].info.dest?.toString();
                    if (back) {
                        let tier;
                        for (const t of kick.tiers) {
                            if (t.id == level) {
                                tier = t;
                                break;
                            }
                        }
                        if (!tier) {
                            continue;
                        }
                        let oldBack = await this.backRepository.getBackByAddress(back);
                        if (oldBack) {
                            let acquired = oldBack.acquired;
                            let idx = acquired.findIndex((v) => { v.id === level });
                            if (idx != -1) {
                                acquired[idx].amount += amount;
                            } else {
                                acquired.push({
                                    id: level,
                                    amount,
                                    description: tier.description,
                                    title: tier.title
                                });
                            }
                            await this.backRepository.updateBackByAddress(this.contractAddress, { acquired });
                        } else {
                            await this.backRepository.createBack({
                                kick: this.contractAddress,
                                back,
                                creator: backer.toString(),
                                acquired: [{
                                    id: level,
                                    amount,
                                    description: tier.description,
                                    title: tier.title
                                }],
                                lastVoted: 0,
                                status: "active"
                            });
                        }

                    }
                }
            } else if (op == 1) {
                await this.kickRepository.updateByAddress(this.contractAddress, { status: "completed" });
            } else if (op == 2) {
                await this.kickRepository.updateByAddress(this.contractAddress, { status: "voting", lastVoteNumber: kick.lastVoteNumber + 1 });
            } else if (op == 3) {
                let voted = kick.voted ?? 0;
                let voter = body.loadAddress();
                let vote = body.loadUint(64);

                voted += vote;

                let update: KickUpdateDto = { voted };

                if (voted * 0.8 > kick.raisedSum) {
                    update.status = "milestone";
                }

                await this.kickRepository.updateByAddress(this.contractAddress, update);
                await this.backRepository.updateBackByAddress(sender, { lastVoted: kick.lastVoteNumber });
            } else if (op == 4) {
                await this.backRepository.updateBackByAddress(sender, { status: "refunded" });
            }

        }
        let lastTx = txs[0];
        await this.contractRepository.updateContractData(this.contractAddress, {
            address: this.contractAddress,
            lastLt: lastTx.lt.toString(),
            lastParsedHash: lastTx.hash.toString()
        });
    }
}