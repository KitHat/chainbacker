import { Request, Response } from "express";
import { KickRepository } from "../repositories/kick.repository";
import { Kick } from "../models/kick";

export async function getKickById(req: Request, resp: Response, repo: KickRepository) {
    let id = parseInt(req.params.id);
    if (!id) {
        resp.status(400).json({
            success: false,
            error: "id must be a number"
        });
        return;
    }
    let kick = await repo.getKickById(id);
    resp.status(200).json({
        success: true,
        result: kick
    });
}