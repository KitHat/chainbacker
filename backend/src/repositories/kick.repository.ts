import { MongoClient, ObjectId } from "mongodb";
import { Kick, KickType } from "../models/kick";
import { Pagination } from "../models/common";

export interface KickFilter {
    kickType?: KickType
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
        let { kickType } = filterBy;

        let filter: { type?: KickType } = {};

        if (kickType) {
            filter.type = kickType;
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

    async getKickById(id: number): Promise<Kick | null> {
        return await this.client
            .db(this.dbName)
            .collection<Kick>(KickRepository.COLLECTION)
            .findOne({ id: id });
    }

    async upsertKickByMarker(marker: number, kick: Kick) {
        await this.client.db(this.dbName).collection<Kick>(KickRepository.COLLECTION).updateOne({ marker: marker }, kick, { upsert: true });
    }
}