import { Request, Response } from "express";
import { isKickType } from "../models/kick";
import { KickFilter, KickRepository } from "../repositories/kick.repository";
import { Pagination } from "../models/common";

export async function getKicks(request: Request, response: Response, repository: KickRepository) {
    let { offset, limit, type } = request.query;

    let filter: KickFilter = {};
    let pagination: Pagination = {};

    if (type) {
        type = type.toString();
        if (!isKickType(type)) {
            response.status(400).json({
                success: false,
                error: "malformed type"
            });
            return;
        }
        filter.kickType = type;
    }

    if (offset) {
        offset = offset.toString();
        let parsed = parseInt(offset);
        if (!parsed) {
            response.status(400).json({
                success: false,
                error: "malformed offset"
            });
            return;
        }
        pagination.offset = parsed;
    }

    if (limit) {
        limit = limit.toString();
        let parsed = parseInt(limit);
        if (!parsed) {
            response.status(400).json({
                success: false,
                error: "malformed limit"
            });
            return;
        }
        pagination.limit = parsed;
    }

    let kicks = await repository.getKicks(filter, pagination);

    response.status(200).json({
        success: true,
        result: kicks
    })
}