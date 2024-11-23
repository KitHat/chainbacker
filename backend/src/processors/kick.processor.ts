import TonWeb from "tonweb";
import { Kick } from "../models/kick";
import { BackRepository } from "../repositories/back.repository";
import { KickRepository, KickUpdateDto } from "../repositories/kick.repository";
import { TonClient, Address, Cell, Slice, BitString } from '@ton/ton';
import { Base64BitReader } from "./b64reader";

interface ContractQueryOptions {
    limit: number,
    hash?: string,
    lt?: string
}

export class KickProcessor {
    private client: TonWeb;
    private kickRepository: KickRepository;
    private backRepository: BackRepository;
    constructor(kickRepository: KickRepository, backRepository: BackRepository, tonConnString: string) {
        this.client = new TonWeb(
            new TonWeb.HttpProvider(
                tonConnString,
                { apiKey: "afb54708ff14cc756ad0b114298c9863b9cecc8d05a65e25911322afe76e7a99" }
            )
        );
        this.kickRepository = kickRepository;
        this.backRepository = backRepository;
    }

    async run() {
        console.log("Running kick update");
        let kicks = await this.kickRepository.getKicks({ status: ["active", "completed", "failed", "voting", "milestone"] }, {});

        console.log(`Processing ${kicks.length} kicks`);
        for (const kick of kicks) {
            await this.processKick(kick);
        }
    }

    async processKick(kick: Kick) {
        let lt = undefined;
        let hash = undefined;

        let finish = false;

        let txs = await this.client.getTransactions(kick.address, 1, lt, hash);
        let first_lt = txs[0].transaction_id.lt;
        let first_hash = txs[0].transaction_id.hash;
        await this.kickRepository.updateByAddress(kick.address, {
            lastLt: first_lt,
            lastParsedHash: first_hash
        });
        while (!finish) {
            let txs = await this.client.getTransactions(kick.address, 100, lt, hash);
            lt = txs[txs.length - 1].transaction_id.lt;
            hash = txs[txs.length - 1].transaction_id.hash;
            console.log(`Processing ${txs.length} transactions`);
            let i = 1;
            if (!kick.lastParsedHash) {
                finish = txs.length != 100;
            }
            for (const tx of txs) {
                if (tx.transaction_id.hash === kick.lastParsedHash) {
                    console.log(`Parsed everything`);
                    finish = true;
                    break;
                }
                console.log(`Processing tx ${i}`);
                let msg = tx.in_msg;
                if (!msg) {
                    console.log("no in msg");
                    continue;
                }
                let body_data = msg.message;
                let reader = new Base64BitReader(body_data);
                if (reader.getTotalBits() < 32) {
                    console.log("small message, probably deploy");
                    continue;
                }
                let op = BigInt(reader.readBits(32));
                console.log(op);
                const queryIdHigh = BigInt(reader.readBits(32));
                const queryIdLow = BigInt(reader.readBits(32));
                const queryId = (queryIdHigh << 32n) | queryIdLow;
                console.log(queryId);
                let sender = msg.source;
                if (!sender) {
                    console.log("no sender");
                    continue;
                }
                if (op == BigInt(0x7362d09c)) {
                    console.log(`Parsing incoming transfer`);
                    let size = reader.readBits(4);
                    console.log(`coin_size, ${size}`);
                    let full = 0n;
                    while (size > 0) {
                        let next = BigInt(reader.readBits(8));
                        full = full << 8n | next;
                        console.log(full);
                        size -= 1;
                    }
                    const receivedAmount = full;
                    console.log(`Received ${receivedAmount}`);
                    let skip = reader.readBits(3);
                    let wc = reader.readBits(8);
                    const addressHashBits: number[] = [];
                    for (let i = 0; i < 32; i++) { // 256 bits = 32 bytes
                        addressHashBits.push(reader.readBits(8));
                    }
                    const addressHash = Buffer.from(addressHashBits);
                    let backer = new Address(wc, addressHash);
                    let level = reader.readBits(8);
                    let amount = reader.readBits(16);
                    await this.kickRepository.updateByAddress(kick.address, {
                        raisedSum: kick.raisedSum + Number(receivedAmount)
                    });
                    for (const msg of tx.out_msgs) {
                        let body = msg.message;
                        let readerOut = new Base64BitReader(body);
                        let op = readerOut.readBits(32);
                        if (op !== 1) {
                            console.log("wrong message");
                            continue;
                        }
                        let back = msg.destination;
                        if (back) {
                            let tier = kick.tiers[level];
                            if (!tier) {
                                continue;
                            }
                            let oldBack = await this.backRepository.getBackByAddress(back);
                            if (oldBack) {
                                console.log("back found");
                                let acquired = oldBack.acquired;
                                let found = false;
                                console.log(JSON.stringify(acquired));
                                for (const tier of acquired) {
                                    if (tier.id == level) {
                                        found = true;
                                        tier.amount += amount;
                                    }
                                }
                                console.log(JSON.stringify(acquired));
                                if (!found) {
                                    console.log("first purchase");
                                    acquired.push({
                                        id: level,
                                        amount,
                                        description: tier.description,
                                        title: tier.title
                                    });
                                }
                                await this.backRepository.updateBackByAddress(back, { acquired });
                            } else {
                                console.log("back not found");
                                let res = await this.backRepository.createBack({
                                    kick: kick.address,
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
                } else if (op == 1n) {
                    await this.kickRepository.updateByAddress(kick.address, { status: "completed" });
                } else if (op == 2n) {
                    await this.kickRepository.updateByAddress(kick.address, { status: "voting", lastVoteNumber: kick.lastVoteNumber + 1 });
                } else if (op == 3n) {
                    let voted = kick.voted ?? 0;
                    let skip = reader.readBits(3);
                    let wc = reader.readBits(8);
                    const addressHashBits: number[] = [];
                    for (let i = 0; i < 32; i++) { // 256 bits = 32 bytes
                        addressHashBits.push(reader.readBits(8));
                    }
                    const addressHash = Buffer.from(addressHashBits);
                    let voter = new Address(wc, addressHash);
                    const voteHigh = reader.readBits(32);
                    const voteLow = reader.readBits(32);
                    const vote = (voteHigh << 32) | voteLow;

                    voted += vote;

                    let update: KickUpdateDto = { voted };

                    if (voted * 0.8 > kick.raisedSum) {
                        update.status = "milestone";
                    }

                    await this.kickRepository.updateByAddress(kick.address, update);
                    await this.backRepository.updateBackByAddress(sender, { lastVoted: kick.lastVoteNumber });
                } else if (op == 4n) {
                    await this.backRepository.updateBackByAddress(sender, { status: "refunded" });
                } else if (op == 6n) {
                    let skip = reader.readBits(3);
                    let wc = reader.readBits(8);
                    const addressHashBits: number[] = [];
                    for (let i = 0; i < 32; i++) { // 256 bits = 32 bytes
                        addressHashBits.push(reader.readBits(8));
                    }
                    const addressHash = Buffer.from(addressHashBits);
                    let usdt = new Address(wc, addressHash);
                    console.log(`Saved USDT address ${usdt.toString()}`);
                }
            }
        }
    }
}