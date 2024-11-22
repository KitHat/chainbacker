import { Request, Response } from "express";
import { KickRepository } from "../repositories/kick.repository";
import { isKickType } from "../models/kick";


export async function createKick(req: Request, res: Response, repository: KickRepository) {
    let { title, description, file, type, tiers, expirationDate, milestones, address, totalSum, creator } = req.body;

    if (typeof title !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed title"
        });
        return;
    }

    if (typeof creator !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed creator"
        });
        return;
    }

    if (typeof description !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed description"
        });
        return;
    }

    if (typeof file !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed image"
        });
        return;
    }

    if (!isKickType(type)) {
        res.status(400).json({
            success: false,
            error: "malformed type"
        });
        return;
    }

    if (typeof expirationDate !== "number") {
        res.status(400).json({
            success: false,
            error: "malformed timestamp"
        });
        return;
    }
    if (typeof address !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed address"
        });
        return;
    }

    await repository.insertKick({
        title,
        creator,
        description,
        file,
        type,
        tiers,
        address,
        expirationDate,
        milestones,
        totalSum,
        raisedSum: 0,
        status: "active",
        lastVoteNumber: 0
    })
}