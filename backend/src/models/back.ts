export interface Back {
    kick: string,
    back: string,
    creator: string
    acquired: AcquiredTier[],
    lastVoted: number,
    status: BackStatus
}

export interface AcquiredTier {
    id: number,
    amount: number,
    title: string,
    description: string
}

export type BackStatus = "active" | "fulfilled" | "refunded";