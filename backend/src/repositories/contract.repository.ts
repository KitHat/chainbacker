import { MongoClient } from "mongodb";
import { ContractData } from "../models/contract";

export class ContractRepository {
    private static COLLECTION = "contracts";
    private dbName: string;
    private client: MongoClient;
    constructor(dbName: string, connString: string) {
        const options = {
            minPoolSize: 1,
            maxPoolSize: 10
        };

        this.dbName = dbName;
        this.client = new MongoClient(connString, options);
    }

    async getContractData(address: string): Promise<ContractData | null> {
        return await this.client.db(this.dbName).collection<ContractData>(ContractRepository.COLLECTION).findOne({ address: address });
    }

    async updateContractData(address: string, data: ContractData) {
        await this.client.db(this.dbName).collection<ContractData>(ContractRepository.COLLECTION).updateOne({ address: address }, data, { upsert: true });
    }
}