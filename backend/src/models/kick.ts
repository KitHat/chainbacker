import { Milestone } from "./milestone";
import { Tier } from "./tier";

export type KickType = "art" | "tech" | "games" | "film" | "music";

export type KickStatus = "active" | "completed" | "failed" | "voting" | "milestone" | "archived";

export function isKickType(value: string): value is KickType {
    return ["art", "tech", "games", "film", "music"].includes(value);
}

export interface Kick {
    title: string,
    creator: string,
    description: string
    type: KickType,
    expirationDate: number
    totalSum: number,
    raisedSum: number,
    file: string,
    tiers: Tier[],
    milestones: Milestone[],
    status: KickStatus,
    address: string,
    voted?: number,
    lastVoteNumber: number
}