import { MongoClient } from "mongodb";
import { AcquiredTier, Back, BackStatus } from "../models/back";
import { Pagination } from "../models/common";

export interface BackUpdateDto {
    lastVoted?: number,
    status?: BackStatus,
    acquired?: AcquiredTier[]
}

export class BackRepository {
    private static COLLECTION = "backs";
    private dbName: string;
    private client: MongoClient;

    constructor(connString: string, dbName: string) {
        const options = {
            minPoolSize: 1,
            maxPoolSize: 10
        };

        this.dbName = dbName;
        this.client = new MongoClient(connString, options);
    }

    async getBacksByUser(user: string, pagination: Pagination): Promise<Back[]> {
        let { limit = 10, offset = 0 } = pagination;
        let backs = await this.client
            .db(this.dbName)
            .collection<Back>(BackRepository.COLLECTION)
            .find({ creator: user })
            .skip(offset)
            .limit(limit)
            .toArray();
        return backs;
    }

    async getBackByAddress(address: string): Promise<Back | null> {
        return await this.client.db(this.dbName).collection<Back>(BackRepository.COLLECTION).findOne({ back: address });
    }

    async createBack(back: Back) {
        await this.client.db(this.dbName).collection<Back>(BackRepository.COLLECTION).insertOne(back);
    }

    async updateBackByCreatorAndKick(creator: string, kick: string, update: BackUpdateDto) {
        await this.client.db(this.dbName).collection<Back>(BackRepository.COLLECTION).updateOne({
            creator: creator,
            kick: kick
        }, update);
    }

    async updateBackByAddress(back: string, update: BackUpdateDto) {
        await this.client.db(this.dbName).collection<Back>(BackRepository.COLLECTION).updateOne({
            back: back
        }, update);
    }
}