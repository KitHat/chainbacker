import { MongoClient, ObjectId } from "mongodb";
import { Kick, KickStatus, KickType } from "../models/kick";
import { Pagination } from "../models/common";

export interface KickFilter {
    kickType?: KickType,
    creator: string
}

export interface KickUpdateDto {
    status?: KickStatus,
    voted?: number,
    lastVoteNumber?: number
}

export class KickRepository {
    private static COLLECTION = "kicks";
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

    async getKicks(filterBy: KickFilter, pagination: Pagination): Promise<Kick[]> {
        let { limit = 10, offset = 0 } = pagination;
        let { kickType, creator } = filterBy;

        let filter: { type?: KickType, creator?: string } = {};

        if (kickType) {
            filter.type = kickType;
        }

        if (creator) {
            filter.creator = creator;
        }

        let kicks = await this.client
            .db(this.dbName)
            .collection<Kick>(KickRepository.COLLECTION)
            .find(filter)
            .skip(offset)
            .limit(limit)
            .toArray();

        return kicks;
    }

    async updateByAddress(address: string, update: KickUpdateDto) {
        await this.client.db(this.dbName).collection<Kick>(KickRepository.COLLECTION).updateOne({ address: address }, update);
    }

    async getKickByAddress(address: string): Promise<Kick | null> {
        return await this.client
            .db(this.dbName)
            .collection<Kick>(KickRepository.COLLECTION)
            .findOne({ address: address });
    }

    async insertKick(kick: Kick) {
        await this.client.db(this.dbName).collection<Kick>(KickRepository.COLLECTION).insertOne(kick);
    }
}