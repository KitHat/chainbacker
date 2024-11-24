import { Request, Response } from "express";
import { Pagination } from "../models/common";
import { BackRepository } from "../repositories/back.repository";

export async function getBacks(request: Request, response: Response, repository: BackRepository) {
    let { backer } = request.query;

    let pagination: Pagination = {};

    if (!backer) {
        response.status(200).json({
            success: false
        });
        return;
    }
    backer = backer.toString();

    let backs = await repository.getBacksByUser(backer, pagination);

    response.status(200).json({
        success: true,
        result: backs
    })
}