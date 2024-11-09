import { Level } from "./level";

export type KickType = "art" | "tech" | "games" | "film" | "music";

export function isKickType(value: string): value is KickType {
    return ["art", "tech", "games", "film", "music"].includes(value);
}

export interface Kick {
    id?: number;
    title?: string;
    description?: string;
    image?: string;
    target?: number;
    type?: KickType;
    validUntil?: number;
    marker: number;
    creator?: string;
    levels: Level[];
}