import { Level } from "../models/level";
import { ContractRepository } from "../repositories/contract.repository";
import { KickRepository } from "../repositories/kick.repository";
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
    private contractRepository: ContractRepository;
    constructor(kickRepository: KickRepository, contractRepository: ContractRepository, contractAddress: string, tonConnString: string) {
        this.contractAddress = contractAddress;
        this.client = new TonClient({
            endpoint: tonConnString
        });
        this.kickRepository = kickRepository;
        this.contractRepository = contractRepository;
    }

    async run() {
        let contractData = await this.contractRepository.getContractData(this.contractAddress);
        let options: ContractQueryOptions = {
            limit: 100
        };
        if (contractData) {
            options.hash = contractData.last_parsed_hash;
            options.lt = contractData.last_lt;
        }

        let txs = await this.client.getTransactions(Address.parse(this.contractAddress), options);
        for (const tx of txs) {
            let msg = tx.inMessage;
            if (!msg) {
                continue;
            }
            let body = msg.body.beginParse();
            let op = body.loadUint(32);
            if (op == 2) {
                let queryId = body.loadUint(64);
                let target = body.loadUint(256);
                let creator = body.loadAddress();
                let marker = body.loadUint(256);
                let validUntil = body.loadUint(64);
                let levelNumber = body.loadUint(8);
                let levelId = 0;
                let levels: Level[] = [];
                while (levelId < levelNumber) {
                    levels.push({
                        id: levelId,
                        price: body.loadUint(256),
                        limit: body.loadUint(16)
                    });
                    levelId += 1;
                }
                await this.kickRepository.upsertKickByMarker(marker, {
                    marker,
                    levels,
                    target,
                    creator: creator.toString(),
                    validUntil
                })
            } else if (op == 3) {
                // this is a back
            } else if (op == 4) {
                // this is kick resolution
            }

        }
        let lastTx = txs[0];
        await this.contractRepository.updateContractData(this.contractAddress, {
            address: this.contractAddress,
            last_lt: lastTx.lt.toString(),
            last_parsed_hash: lastTx.hash.toString()
        });
    }
}