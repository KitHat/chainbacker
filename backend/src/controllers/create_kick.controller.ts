import { Request, Response } from "express";
import { KickRepository } from "../repositories/kick.repository";
import { KickType, isKickType } from "../models/kick";
import { Level } from "../models/level";
import crypto from 'crypto';

interface KickDto {
    title: string;
    description: string;
    image: string;
    type: KickType;
    levels: Level[];
    timestamp: number;
}

export async function createKick(req: Request, res: Response, repository: KickRepository) {
    let { title, description, image, type, levels, timestamp } = req.body;

    if (typeof title !== "string") {
        res.status(400).json({
            success: false,
            error: "malformed title"
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

    if (typeof image !== "string") {
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

    if (typeof timestamp !== "number") {
        res.status(400).json({
            success: false,
            error: "malformed timestamp"
        });
        return;
    }

    let toHash = `${timestamp}${title}`;
    let marker = crypto.createHash('md5').update(toHash).digest().readBigUint64BE();

    await repository.upsertKickByMarker(marker, {
        title,
        description,
        image,
        type,
        levels,
        marker
    })
}