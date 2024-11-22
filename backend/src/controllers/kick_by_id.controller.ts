import { Request, Response } from "express";
import { KickRepository } from "../repositories/kick.repository";
import { Kick } from "../models/kick";

export async function getKickByAddress(req: Request, resp: Response, repo: KickRepository) {
    let address = parseInt(req.params.address);
    if (typeof address !== "string") {
        resp.status(400).json({
            success: false,
            error: "address must be a string and must exist"
        });
        return;
    }
    let kick = await repo.getKickByAddress(address);
    resp.status(200).json({
        success: true,
        result: kick
    });
}